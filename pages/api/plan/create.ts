import 'mysql2'
import { createConnection } from 'mysql2/promise'
import { NextApiRequest, NextApiResponse } from 'next'
interface ReqData {
  email: string
  date: Date
  principal: number
  base: number
  interest: number
  installments: number
}

interface ResData {
  id: string
  email: string
  date: Date
  principal: number
  base: number
  interest: number
  installments: number
}

async function dbQuery({
  email,
  date,
  principal,
  base,
  interest,
  installments,
}: ReqData) {
  const connection = await createConnection(process.env.DATABASE_URL)
  const [data] = await connection.query(
    'INSERT INTO `plans` (email, date, principal base, interest, installments) VALUES \
    (?, ?, ?, ?, ?, ?)',
    [email, date, principal, base, interest, installments]
  )
  connection.end()
  return data[0]
}

function isToday(date: Date) {
  const today = new Date()
  return (
    date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
  )
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResData>
) {
  const { method, body } = req
  const { date } = body as ReqData
  if (!isToday(date)) {
    res.status(400).end(`Date ${date} has expired`)
    return
  }
  switch (method) {
    case 'POST':
      dbQuery(body).then((data) => {
        res.status(200).json(data as ResData)
      })
      res.status(200)
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
