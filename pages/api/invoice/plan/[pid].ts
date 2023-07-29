import { createConnection } from 'mysql2/promise'
import { NextApiRequest, NextApiResponse } from 'next'

interface ReqData {
  pid: string
}
interface ResData {
  id: number
  pid: number
  email: string
  due: string
  amnt_due: number
  total: number
  fulfilled: boolean
}

async function dbQuery({ pid }: ReqData) {
  const connection = await createConnection(process.env.DATABASE_URL)
  const [data] = await connection.query(
    'SELECT * FROM `invoices` WHERE `pid` = ?',
    [pid]
  )
  connection.end()
  return data
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResData[]>
) {
  const { method, query } = req
  switch (method) {
    case 'GET':
      dbQuery({ pid: query.pid as string }).then((data) => {
        res.status(200).json(data as ResData[])
      })
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
