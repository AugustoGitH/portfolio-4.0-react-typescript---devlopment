import useFetchRepos from "../../../../../queries/repos"
import { TRepositorie } from "../../../../../types/Repositorie"
import * as S from "../styles"
import InputDefault from "./InputDefault"
import { useState, useEffect, useRef } from "react"

type TPropsSelect = {
  onChange: (idRepo: number | null) => void,
  reset?: boolean,
  disabled?: boolean
}

const InputSelectIdRepo = ({ onChange, reset = false, disabled = false }: TPropsSelect) => {
  const [reposFocus, setReposFocus] = useState<TRepositorie[]>([])
  const { data: reposData } = useFetchRepos()
  const [showOptions, setShowOptions] = useState(false)
  const [idSelected, setIdSelected] = useState<number | null>(null)
  const [nameRepo, setNameRepo] = useState("")

  const refSelected = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (reposData) {
      setReposFocus(reposData)
    }
  }, [reposData])



  useEffect(() => {
    const handleEventBlurSelected = (ev: MouseEvent) => {
      if (refSelected.current && !refSelected.current.contains(ev.target as Node)) {
        setShowOptions(false)
      }
    }

    if (showOptions) {
      document.addEventListener("click", handleEventBlurSelected)
    }
    return () => document.removeEventListener("click", handleEventBlurSelected)
  }, [showOptions])


  useEffect(() => {
    if (reset) {
      setNameRepo("")
      setIdSelected(null)
      setReposFocus(reposData || [])
    }
  }, [reset])



  useEffect(() => {
    onChange(idSelected)
  }, [idSelected])

  const handleClickRepo = (idRepo: number, nameRepo: string) => {
    setIdSelected(idRepo)
    setNameRepo(nameRepo)
    setShowOptions(false)
  }

  const handleChangeInputSearh = (valueSearch: string) => {
    if (!reposData) return
    if (reposFocus.length === 0 || !valueSearch) {
      setIdSelected(null)
    }
    const valueSearchTrated = valueSearch.toLowerCase()
    setReposFocus(reposData.filter(repo => {
      const repoNameTrated = repo.name.replace(/-/g, " ").toLowerCase()
      return repoNameTrated.includes(valueSearchTrated) || repo.name.includes(valueSearchTrated)
    }))
  }




  return (
    <S.InputSelectIdRepo ref={refSelected} disabled={disabled}>
      <InputDefault
        label="Digite o nome do repositório"
        onFocus={() => setShowOptions(true)}
        onClick={() => setShowOptions(true)}
        value={nameRepo}
        onChange={(e) => { handleChangeInputSearh(e.target.value), setNameRepo(e.target.value) }}
      />
      {idSelected && (<span className="id-repo">{idSelected}</span>)}
      {
        showOptions && (
          <div className="select-repositories-modal" onBlur={() => setShowOptions(false)}>
            {/* <div className="input-link-other-repositorie" >
              <label>Link externo</label>
              <input />
            </div> */}
            <ul className="results-search-repositories">
              {
                reposFocus?.map(repo => (
                  <li key={repo.id} className="repository-result" onClick={() => handleClickRepo(repo.id, repo.name)}>
                    <span>{repo.name}</span>
                    <span>{repo.id}</span>
                  </li>
                ))
              }
              {
                reposFocus.length === 0 && (
                  <li className="not-found-repositories">Nenhum repositorio foi encontrado!</li>
                )
              }
            </ul>
          </div>
        )
      }
    </S.InputSelectIdRepo>
  )
}


export default InputSelectIdRepo