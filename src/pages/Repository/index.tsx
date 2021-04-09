import React, { useEffect, useState } from 'react'
import { useRouteMatch, Link } from 'react-router-dom'
import { Header, RepositoryInfo, Issues } from './styles'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import api from '../../services/api'

import LogoImg from '../../assets/logo.svg'

interface RepositoryParams{
    repository: string
}


interface Repository_{
    id: number;
    full_name: string;
    description: string;
    stargazers_count: number;
    language: string;
    forks_count: number;
    owner: {
        login: string;
        avatar_url: string;
    }
}

interface Issue {
    title: string;
    html_url: string;
    id: number;
    user: {
        login: string;
    }
}

const Repository: React.FC = () => {
    const { params } = useRouteMatch<RepositoryParams>()

    const [ repository, setRepository ] = useState<Repository_ | null >(null)
    const [ issues, setIssues ] = useState<Issue[]>([])

    useEffect( () => {
        api.get(`repos/${params.repository}`).then(response => {
            setRepository(response.data)
        })

        api.get(`/repos/${params.repository}/issues`).then(response => {
            setIssues(response.data)
        })

    }, [params.repository])

    return (
        <>
            <Header>

                <img src={LogoImg} alt="GitHub Explorer"/>

                <Link to="/">
                    <FiChevronLeft size={16}></FiChevronLeft>
                    Voltar
                </Link>

            </Header>

            { repository && (
                <RepositoryInfo>

                    <header>

                        <img src={repository.owner.avatar_url} alt={repository.owner.login}/>

                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>

                    </header>

                    <ul>
                        <li>
                            <strong>{repository.language}</strong>
                            <span>language</span>
                        </li>
                        <li>
                            <strong>{repository.forks_count}</strong>
                            <span>forks</span>
                        </li>
                        <li>
                            <strong>{repository.stargazers_count}</strong>
                            <span>stars</span>
                        </li>
                    </ul>

                </RepositoryInfo>
            )}

            <Issues>
                { issues.map(issue => {
                    return(
                        <a key={issue.id} href={issue.html_url}>
                            <div>
                                <strong>{issue.title}</strong>
                                <p>{issue.user.login}</p>
                            </div>

                            <FiChevronRight size={20}/>
                        </a>
                    )
                })}
            </Issues>

        </>
    )
}

export default Repository
