import moment from 'moment'
import 'mysql2'
import { createConnection } from 'mysql2/promise'
import { NextApiRequest, NextApiResponse } from 'next'
import { createTransport } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'

interface InvoiceData {
  id: number
  pid: number
  email: string
  due: string
  amnt_due: number
  total: number
  fulfilled: boolean
}

async function dbQuery() {
  const connection = await createConnection(process.env.DATABASE_URL)
  const invoices = (
    await connection.query(
      'SELECT * FROM `invoices` WHERE `due` = ? AND `fulfilled` = 0',
      [moment().add(5, 'd').format('YYYY-MM-DD')]
    )
  )[0] as InvoiceData[]
  connection.end()
  return invoices
}

async function sendEmail(invoice: InvoiceData) {
  const message = {
    from: {
      name: 'AssureX',
      address: 'info@assurex.com',
    },
    to: invoice.email,
    subject: `Reminder: Your AssureX Payment is Due in 5 Day`,
    text: `Reminder that your AssureX payment of ${invoice.amnt_due} is due in 5 days`,
    // html: '',
  } as Mail.Options
  const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  })

  const info = await transporter.sendMail(message)
  return {
    success: info.accepted.length != 0,
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req
  if (method != 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }
  const invoices = await dbQuery()
  invoices.forEach(sendEmail)
  res.status(200)
}
