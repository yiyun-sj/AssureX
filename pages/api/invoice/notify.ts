import moment from 'moment'
import 'mysql2'
import { createConnection } from 'mysql2/promise'
import { NextApiRequest, NextApiResponse } from 'next'
import { createTransport } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { notifyHtml, notifyText } from '../../../email/notify'

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
    subject: `Reminder: Your AssureX Payment is Due Soon`,
    text: notifyText(invoice),
    html: notifyHtml(invoice),
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
  const res = await transporter.sendMail(message)
  console.log(res)
}

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const invoices = await dbQuery()
  invoices.forEach(sendEmail)
  res.status(200).send('ok')
}
