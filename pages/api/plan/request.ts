import moment from 'moment'
import { NextApiRequest, NextApiResponse } from 'next'

const periods = [3, 6, 9, 12]
const interest = 24 // %

interface ReqData {
  email: string
  name: string
  principal: number
}
interface ResData {
  email: string
  name: string
  date: string
  principal: number
  base: number
  interest: number
  installments: number
}

const calcInterest = (APR: number, periods: number, principal: number) =>
  principal * ((1 + APR / 100 / 12) ** periods - 1)

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResData[] | string>
) {
  const { method } = req
  switch (method) {
    case 'OPTIONS':
      res.status(200).send('ok')
      break
    case 'POST':
      const { email, principal, name } = req.body as ReqData
      const resData: ResData[] = periods.map((period) => {
        return {
          email,
          name,
          date: moment().format('YYYY-MM-DD'),
          principal,
          base: Math.ceil(calcInterest(interest, period, principal) / period),
          interest,
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
