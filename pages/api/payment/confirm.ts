import moment from 'moment'
import 'mysql2'
import { ResultSetHeader, createConnection } from 'mysql2/promise'
import { NextApiRequest, NextApiResponse } from 'next'
import { Client, Wallet, dropsToXrp } from 'xrpl'

interface ReqData {
  hash: string
  email: string
  pid: number
  rate: number
}

interface PayData {
  date: string
  origin: string
  destination: string
  amount: number
}

interface ResData {
  id: number
  pid: number
  email: string
  date: string
  origin: string
  destination: string
  amount: number
}

interface InvoiceData {
  id: number
  pid: number
  email: string
  due: string
  amnt_due: number
  total: number
  fulfilled: boolean
}

const secs = moment('2000-01-01').unix() - moment.unix(0).unix()

async function dbQuery(
  { date, origin, destination, amount }: PayData,
  { email, pid, rate }: ReqData
) {
  const connection = await createConnection(process.env.DATABASE_URL)
  const [hdr] = await connection.query(
    'INSERT INTO `payments` (pid, email, date, origin, destination, amount) VALUES ?',
    [[[pid, email, date, origin, destination, amount]]]
  )

  const amountTotal = Math.floor(Number(dropsToXrp(amount)) * rate * 100)
  let amountLeft = amountTotal
  const invoices = (
    await connection.query('SELECT * FROM `invoices` WHERE `pid` = ?', [pid])
  )[0] as InvoiceData[]
  invoices.forEach(async (invoice) => {
    if (amountTotal <= 0) return
    if (invoice.fulfilled) return
    invoice.fulfilled = amountLeft >= invoice.amnt_due
    const subAmount = Math.min(amountLeft, invoice.amnt_due)
    amountLeft -= subAmount
    invoice.amnt_due -= subAmount
    await connection.query(
      'UPDATE `invoices` SET amnt_due = ?, fulfilled = ? WHERE `pid` = ?',
      [invoice.amnt_due, invoice.fulfilled, pid]
    )
  })

  connection.end()
  return {
    id: (hdr as ResultSetHeader).insertId,
    pid,
    email,
    date,
    origin,
    destination,
    amount,
  }
}

async function confirmPayment({ hash }: ReqData) {
  const client = new Client(process.env.XRP_ENDPOINT)
  await client.connect()

  const wallet = Wallet.fromSeed(process.env.ASSUREX_SEED)
  const response = await client.request({
    command: 'tx',
    transaction: hash,
    binary: false,
  })
  client.disconnect()
  return !(
    response.result &&
    response.result.TransactionType == 'Payment' &&
    response.result.Destination === wallet.address &&
    typeof response.result.Amount === 'string'
  )
    ? false
    : {
        date: moment.unix(response.result.date + secs).format('YYYY-MM-DD'),
        origin: response.result.Account,
        destination: wallet.address,
        amount: Number(response.result.Amount),
      }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResData | string>
) {
  const { method, body } = req
  if (method == 'OPTIONS') {
    res.status(200).send('ok')
    return
  }
  if (method != 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }
  const payData = await confirmPayment(body)
  if (payData === false) return res.status(400).end('Payment is invalid')
  const resData = await dbQuery(payData, body)
  res.status(200).json(resData)
}
