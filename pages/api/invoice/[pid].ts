import { createConnection } from 'mysql2/promise'
import { NextApiRequest, NextApiResponse } from 'next'

interface ReqData {
  pid: string
}
interface ResData {
  id: number
  pid: number
  due: Date
  amnt_due: number
  total: number
  fulfilled: boolean
}

/* connection.query result:
[
  [
    {
      id: 1,
      pid: 0,
      due: 2023-07-28T04:00:00.000Z,
      amnt_due: 1,
      total: 1,
      fulfilled: 0
    }
  ],
  [
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT NUM,
    `pid` INT NOT NULL NUM,
    `due` DATE(10),
    `amnt_due` FLOAT NUM,
    `total` FLOAT NUM,
    `fulfilled` TINYINT(1) NUM
  ]
] */

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
