import 'mysql2'
import { createConnection } from 'mysql2/promise'
import { NextApiRequest, NextApiResponse } from 'next'
interface ReqData {
  seed: string
  email: string
  name: string
}

async function dbQuery({ seed, email, name }: ReqData) {
  const connection = await createConnection(process.env.DATABASE_URL)
  await connection.query(
    'INSERT INTO `accounts` (seed, email, name) VALUES ?',
    [[[seed, email, name]]]
  )
  connection.end()
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { method, body } = req
  switch (method) {
    case 'OPTIONS':
      res.status(200).send('ok')
      break
    case 'POST':
      dbQuery(body).then(() => {
        res.status(200).send('ok')
      })
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
