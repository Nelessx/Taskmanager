"use client"

import React from "react";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default function Register() {
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: ''
    })

    const handleChanges = (e) => {
        setValues({...values, [e.target.name]:e.target.value})
    }
    const handleSumbit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:4000/auth/register', values)
            if(response.status === 201) {
                navigate('/login')
            }
        } catch(err) {
            console.log(err.message)
        }
    }

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">


        <form onSubmit={handleSumbit} className=" bg-slate-900/50 border-slate-400/70 border-4 rounded-3xl w-4/12 mx-auto p-8 flex flex-col gap-4" >


          <div className="flex flex-col gap-2 items-start ">
            <label htmlFor="username" className="font-semibold text-white/80">Username</label>
            <input type="text" placeholder="Enter Your Username" name="username" onChange={handleChanges} className="bg-slate-900/50 border-slate-400/70 border rounded-xl w-full p-2" />
          </div>


          <div className="flex flex-col gap-2 items-start ">
            <label htmlFor="email" className="font-semibold text-white/80">Email</label>
            <input type="email" placeholder="Enter Your Email" name="email" onChange={handleChanges} className="bg-slate-900/50 border-slate-400/70 border rounded-xl w-full p-2" />
          </div>


          <div className="flex flex-col gap-2 items-start ">
            <label htmlFor="password" className="font-semibold text-white/80">Password</label>
            <input
              type="password"
              placeholder="Enter Your Password"
              name="password"
              onChange={handleChanges}
              className="bg-slate-900/50 border-slate-400/70 border rounded-xl w-full p-2"
            />
          </div>


          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:cursor-pointer"
          >
            Register
          </button>


          <div className="flex items-center justify-center">
            <Link href="/auth/login" className="text-blue-500">Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
