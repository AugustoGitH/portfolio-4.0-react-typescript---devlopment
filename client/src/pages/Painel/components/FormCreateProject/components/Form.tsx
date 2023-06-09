import { useState, useRef, useEffect, ChangeEvent } from "react"
import * as S from "../styles"

import Checkboxes from "../../../../../components/Checkboxes"
import InputDefault from "./InputDefault"
import InputSelectIdRepo from "./InputSelectIdRepo"
import InputImage from "../../../../../components/InputImages"

import { TProjectCreationProcess } from "../../../../../types/Project"
import { modelNewProject } from "../models"

import createProjectService from "../../../../../services/Admin/createProject"

import verifyFormCreatedProject from "../utils/verifyForm"
import LoaderDefault from "../../../../../components/loaders/LoaderDefault"
import { optionsTechProject, optionsTypeProject } from "../../../configs"
import { queryClient } from "../../../../../services/queryClient"



interface IinfInputsBlockRepo {
  repoLink: boolean,
  repoId: boolean
}


const Form = () => {
  const [project, setProject] = useState<TProjectCreationProcess>(modelNewProject)
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const [infInputsBlockRepo, setInfInputsBlockRepo] = useState<IinfInputsBlockRepo>({
    repoLink: false,
    repoId: false
  })

  useEffect(() => {
    const { repoLink, repoId } = project
    setInfInputsBlockRepo({
      repoLink: Boolean(repoLink),
      repoId: Boolean(repoId)
    })
  }, [project])

  const handleChangeAttrProject = (key: keyof TProjectCreationProcess, value: any) => {
    setProject(prevProject => ({ ...prevProject, [key]: value }))
  }

  const createProject = () => {
    const { error, message } = verifyFormCreatedProject(project)
    if (error) return alert(message)

    setIsCreatingProject(true)
    createProjectService(project).then(response => {
      const { created, message } = response
      setIsCreatingProject(false)
      alert(message)
      if (created) {
        resetCreationForm()
        queryClient.invalidateQueries(['projects'])
      }
    })
  }

  const resetCreationForm = () => {
    setIsReset(true)
    setTimeout(() => {
      setIsReset(false)
    }, 20)
    setProject(modelNewProject)
  }

  return (
    <S.Form>
      {
        isCreatingProject && (
          <S.PopUpLoading>
            <LoaderDefault color="light" />
          </S.PopUpLoading>
        )
      }

      <InputDefault
        label="Nome do Projeto"
        value={project.name}
        onChange={ev => handleChangeAttrProject("name", ev.target.value)}
      />
      <InputDefault
        label="Link do Projeto"
        value={project.websiteLink}
        onChange={ev => handleChangeAttrProject("websiteLink", ev.target.value)}
      />
      <InputDefault
        label="Link da Preview"
        value={project.videoLink}
        onChange={ev => handleChangeAttrProject("videoLink", ev.target.value)}
      />
      <InputDefault
        label="Link do repositorio"
        value={project.repoLink}
        onChange={ev => handleChangeAttrProject("repoLink", ev.target.value)}
        disabled={infInputsBlockRepo.repoId}
      />
      <Checkboxes
        options={optionsTypeProject}
        label="Tipo de projeto"
        name="typeProject"
        value={project.type}
        onChange={valueChecked => handleChangeAttrProject("type", valueChecked.value)}
      />
      <Checkboxes
        options={optionsTechProject}
        label="Tecnologias e linguagens mais usadas"
        name="techsProject"
        tagAnyone={true}
        value={project.technologiesUsed}
        onChange={valueChecked => handleChangeAttrProject("technologiesUsed", valueChecked.value)}
      />
      <InputSelectIdRepo
        reset={isReset}
        onChange={idSelected => handleChangeAttrProject("repoId", idSelected)}
        disabled={infInputsBlockRepo.repoLink}
      />
      <InputImage reset={isReset} onChange={images => handleChangeAttrProject("images", images)} />
      <button className="button-create-project" onClick={createProject}><i className='bx bxs-component' />Criar Projeto</button>
    </S.Form>
  )
}

export default Form