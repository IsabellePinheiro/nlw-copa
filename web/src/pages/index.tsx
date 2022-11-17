import Image from 'next/image'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import avatar from '../assets/users-avatar-example.png'
import iconCheck from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps{
  poolCount: number,
  guessCount: number,
  userCount: number
}

export default function Home({poolCount, guessCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent){
    event.preventDefault()

   try{
    const response = await api.post('/pools', {
      title: poolTitle
    })

   

    const {code} = response.data.result
    await navigator.clipboard.writeText(code)
    alert('Bolão criado com sucesso')
    setPoolTitle('')
   } catch(err){
    alert('Falha ao criar o bolão')
   }
  }
  
  return (
   <div className='max-w-[1124px] h-screen gap-28 mx-auto grid grid-cols-2 items-center'>
    <main>
      <Image quality={100} src={logoImg} alt='NLW Copa'/>
      <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>Crie seu próprio bolão e compartilhe entre amigos!</h1>
      <div className='mt-10 flex items-center gap-2'>
        <Image src={avatar} alt='Fotos dos usuários'/>
        <strong className='text-gray-100 text-xl'>
          <span className='text-ignite-500'>+{userCount}</span> pessoas já estão usando
        </strong>
      </div>
      <form onSubmit={createPool} className='mt-10 flex gap-2'>
        <input
        className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
        type='text' onChange={(event) => {setPoolTitle(event.target.value)}} value={poolTitle} required placeholder='Qual nome do seu bolão?'/>
        <button
        className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
        type='submit'>Criar meu bolão</button>
      </form>
      <p
        className='mt-4 text-sm text-gray-100 leading-relaxed'
      >Após criar seu bolão, voce receberá um código que poderá usar para convidar seus amigos</p>
      <div className='mt-10 pt-10 border-t items-center border-gray-600  flex justify-between text-gray-100'>
        <div className='flex items-center gap-6'>
          <Image src={iconCheck} alt=''/>
          <div className='flex flex-col'>
            <span className='font-bold text-2xl'>+{poolCount}</span>
            <span>Bolões criados</span>
          </div>
        </div>
        <div className='w-px h-14 bg-gray-600'/>
        <div className='flex items-center gap-6'>
          <Image src={iconCheck} alt=''/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
        </div>
      </div>
    </main>
    <Image quality={100} src={appPreviewImg} alt='Dois celulares exibindo previa'/>
   </div>
  )
}


export const getServerSideProps = async () => {

  const [poolCountResponse,guessCountResponse, userCountResponse] = await Promise.all(
    [
      api.get('pools/count'),
      api.get('guesses/count'),
      api.get('users/count'),
    ]
  )

  return{
    props:{
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }
}