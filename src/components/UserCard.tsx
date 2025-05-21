'use client'

import React from 'react'
import styles from './UserCard.module.css'
import { FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

// lista de preposições que devem ficar em lowercase
const PREPOSITIONS = new Set(['da','de','do','das','dos','e'])

function formatName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  let displayParts: string[]

  if (parts.length <= 2) {
    // nomes curtos: fica como está (até 2 palavras)
    displayParts = parts
  } else if (PREPOSITIONS.has(parts[1].toLowerCase()) && parts.length > 2) {
    // se a 2ª palavra for preposição, inclui também a 3ª
    displayParts = [parts[0], parts[1], parts[2]]
  } else {
    // caso normal: apenas 1ª e 2ª palavra
    displayParts = [parts[0], parts[1]]
  }

  // aplica Title Case: preposições em lowercase, palavras importantes com Maiúscula inicial
  return displayParts
    .map(word => {
      const lower = word.toLowerCase()
      if (PREPOSITIONS.has(lower)) return lower
      return word[0].toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

interface UserCardProps {
  nome: string
  celular: string
  endereco: string
}

export function UserCard({ nome, celular, endereco }: UserCardProps) {
  const displayName = formatName(nome)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <FaUser />
        <span className={styles.name}>{displayName}</span>
      </div>
      <div className={styles.info}>
        <FaPhone />
        <span>{celular}</span>
      </div>
      <div className={styles.info}>
        <FaMapMarkerAlt />
        <span>{endereco}</span>
      </div>
    </div>
  )
}
