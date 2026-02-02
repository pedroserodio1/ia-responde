export interface MessageDTO {
  id: string | null | undefined
  from: string | null | undefined
  fromMe: boolean | null | undefined
  isGroup: boolean
  isChannel: boolean
  isEvent: boolean
  pushName: string | null
  text: string | null
  timestamp: number
}
