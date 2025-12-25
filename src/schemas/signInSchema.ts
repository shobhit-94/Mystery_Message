import {z} from 'zod'

export const signInSchema=z.object({
    username:z.string(),//username ko identifier bhi bol sakte hai
    password:z.string()
})