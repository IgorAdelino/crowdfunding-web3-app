import React, { useContext, createContext } from 'react'

import {
  metamaskWallet,
  useAddress,
  useConnect,
  useContract,
  useContractWrite,
} from '@thirdweb-dev/react'
import { ethers } from 'ethers'

const StateContext = createContext<any>(undefined)

export const StateContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { contract, error } = useContract(
    '0x70C54326D89Cd406170211FD9880743B5e429DEF',
  )

  if (error) {
    throw new Error('Contract not found')
  }

  const metamaskConfig = metamaskWallet()

  const connect = useConnect()

  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    'createCampaign',
  )

  const address = useAddress()

  const publishCampaign = async (form: {
    title: string
    description: string
    target: string
    deadline: string | number | Date
    image: string
  }) => {
    try {
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          form.target,
          new Date(form.deadline).getTime(), // deadline,
          form.image,
        ],
      })

      console.log('contract call success', data)
    } catch (error) {
      console.log('contract call failure', error)
    }
  }

  const getCampaigns = async () => {
    const campaigns = await contract!.call('getCampaigns')

    const parsedCampaigns = campaigns.map((campaign: any, i: number) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString(),
      ),
      image: campaign.image,
      pId: i,
    }))

    console.log(parsedCampaigns)

    return parsedCampaigns
  }

  return (
    <StateContext.Provider
      value={{
        address,
        connect,
        metamaskConfig,
        contract,
        createCampaign: publishCampaign,
        getCampaigns,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
