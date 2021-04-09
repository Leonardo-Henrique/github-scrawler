import React, { useState, useEffect, FormEvent } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import api from '../../services/api'

import LogoImg from '../../assets/logo.svg'

import { Title, Form, Repositories, Error } from './styles'

interface Repository{
    id: number;
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
}

const Dashboard: React.FC = () => {

    //newRepo se refere ao valor do input
    const [newRepo, setNewRepo] = useState('')
    const [inputError, setInputError] = useState('')
    const [repositories, setRepositories] = useState<Repository[]>(() => {
            const localStorageRepositories = localStorage.getItem('@GitHubExplore:repositories')
            if (localStorageRepositories) {
                return JSON.parse(localStorageRepositories)
            } else {
                return []
            }

    })

    useEffect( () => {
        localStorage.setItem('@GitHubExplore:repositories', JSON.stringify(repositories))
    }, [repositories])

    function handleAddRepository(event: FormEvent<HTMLFormElement>){
        event.preventDefault()

        if(!newRepo){
            setInputError('Digite o nome do autor/repositorio')
            return
        }

        try{

            api.get<Repository>(`repos/${newRepo}`).then(response => {
                const repository = response.data
                setRepositories([...repositories, repository])
            })

            setInputError('')


        }catch(err){

            setInputError('Erro na busca por esse repositório')

        }


        setNewRepo('')
    }

    return (
        <>

        <img src={LogoImg} alt="GitHub explore"/>
        <Title>Explore repositórios no Github.</Title>

        <Form hasError={ !!inputError } onSubmit={handleAddRepository}>
            <input
                value={newRepo}
                onChange={e => setNewRepo(e.target.value)}
                placeholder="Digite o nome do repositório"
            />
            <button>Pesquisar</button>
        </Form>

        { inputError && <Error>{inputError}</Error> }

        <Repositories>

            {repositories.map(repository => {
                return(
                    <Link key={repository.id} to={`/repository/${repository.full_name}`}>
                        <img src={repository.owner.avatar_url}
                        alt={repository.owner.login}/>

                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>

                        <FiChevronRight size={20}/>
                    </Link>
                )
            })}


        </Repositories>

        </>
    )
}

export default Dashboard
