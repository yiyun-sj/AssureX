import 'mysql2'
import { NextApiRequest, NextApiResponse } from 'next'
import { Client, Wallet } from 'xrpl'
interface ReqData {
  amount: string
}

interface ResData {
  id: number
  email: string
  name: string
  date: string
  principal: number
  interest: number
}

async function generateAccount({ amount }: ReqData) {
  const client = new Client(process.env.XRP_ENDPOINT)
  // await client.connect()

  const wallet = Wallet.generate()
  //   const fund_result = await client.fundWallet(wallet, { amount })
  //   console.log(fund_result)

  //   /* fund_result
  //   {
  //   wallet: Wallet {
  //     publicKey: 'ED14EB39B0064A54C85FD74BC52DAE64C5729B1AD02B8CE8C8F7E60791B684E3A3',
  //     privateKey: 'ED81FBB75E3ADD134CC24115734D83677419D9BE0890BBCEF4656E5A4E62CC9DF6',
  //     classicAddress: 'rLnoYsqyp1VNukPdEExyuv53qJhtNPqCKn',
  //     seed: 'sEdV7znR7nTGVTv7tNc1uXs9mss2oth'
  //   },
  //   balance: 1000
  //   }
  // */
  //   const response = await client.request({
  //     command: 'account_info',
  //     account: wallet.address,
  //     ledger_index: 'validated',
  //   })
  //   console.log(response)

  // client.disconnect()
  return wallet
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method, body } = req
  switch (method) {
    case 'GET':
      generateAccount({ amount: '1000' }).then((data) => {
        res.status(200).json(data)
      })
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
