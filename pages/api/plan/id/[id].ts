import { createConnection } from 'mysql2/promise'
import { NextApiRequest, NextApiResponse } from 'next'

interface ReqData {
  id: string
}
interface ResData {
  id: number
  email: string
  name: string
  date: string
  principal: number
  interest: number
}

async function dbQuery({ id }: ReqData) {
  const connection = await createConnection(process.env.DATABASE_URL)
  const [data] = await connection.query(
    'SELECT * FROM `plans` WHERE `id` = ?',
    [id]
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
      dbQuery({ id: query.id as string }).then((data) => {
        res.status(200).json(data as ResData[])
      })
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
