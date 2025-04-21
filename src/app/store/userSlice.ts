import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { User } from '../user/user'

const loadFromLocalStorage = (): User[] => {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem('users')
        return data ? JSON.parse(data) : []
    }
    return []
}

const saveToLocalStorage = (users: User[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('users', JSON.stringify(users))
    }
}

const initialState: User[] = loadFromLocalStorage()

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        createUser(state, action: PayloadAction<User>) {
            state.push(action.payload)
            saveToLocalStorage(state)
        },
        updateUser(state, action: PayloadAction<User>) {
            const index = state.findIndex((u) => u.id === action.payload.id)
            if (index !== -1) {
                state[index] = action.payload
                saveToLocalStorage(state)
            }
        },
        deleteUser(state, action: PayloadAction<string>) {
            const newState = state.filter((u) => u.id !== action.payload)
            saveToLocalStorage(newState)
            return newState
        },
    },
})

export const { createUser, updateUser, deleteUser } = userSlice.actions
export default userSlice.reducer
