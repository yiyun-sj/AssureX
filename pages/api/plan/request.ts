import moment from 'moment'
import { NextApiRequest, NextApiResponse } from 'next'

const periods = [3, 6, 9, 12]
interface ReqData {
  email: string
  principal: number
}
interface ResData {
  email: string
  date: string
  principal: number
  base: number
  interest: number
  installments: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResData[]>
) {
  const { method } = req
  switch (method) {
    case 'POST':
      const { email, principal } = req.body as ReqData
      const resData: ResData[] = periods.map((period) => {
        return {
          email,
          date: moment().format('YYYY-MM-DD'),
          principal,
          base: principal / period,
          interest: 0,
          installments: period,
        }
      })
      res.status(200).json(resData)
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
