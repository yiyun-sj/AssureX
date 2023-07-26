import { NextApiRequest, NextApiResponse } from 'next'

interface Data {
  success: boolean
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req
  switch (method) {
    case 'POST':
      const data = req.body
      res.status(200).json({ success: true })
      break
    default:
      res.setHeader('Allow', ['POST'])
      res
        .status(405)
        .end(`Method ${method} Not Allowed`)
        .json({ success: false })
      break
  }
}
