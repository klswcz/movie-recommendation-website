import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import Button from "../UI/Form/Button";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import {
    destroy as destroyAccountService,
    get as getAccountService,
    update as updateAccountService,
    updatePassword as updatePasswordService
} from "../../services/AccountServices";
import Input from "../UI/Form/Input";
import {useDispatch} from "react-redux";

function Account(props) {
    let history = useHistory();
    let dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const MySwal = withReactContent(Swal)

    useEffect(() => {
        if (localStorage.getItem('token') === 'null') {
            history.push({pathname: "/"});
        } else {
            getAccountService().then(res => {
                setEmail(res.data.email)
                setFirstName(res.data.first_name)
                setLastName(res.data.last_name)
            })
        }
    }, [history]);

    const updateAccount = () => {
        updateAccountService({
            email: email,
            first_name: firstName,
            last_name: lastName,
        }).then(res => {
            setEmail(res.data.email)
            setFirstName(res.data.first_name)
            setLastName(res.data.last_name)
            localStorage.setItem('token', res.data.token)
        })
    }

    const updatePassword = () => {
        const passwordField = document.getElementById('password');
        const confirmPasswordField = document.getElementById('confirm_password');

        if (
            passwordField.value === confirmPasswordField.value
        ) {
            confirmPasswordField.setCustomValidity('');
            updatePasswordService({
                old_password: oldPassword,
                password: password,
            }).then(res => {
                setOldPassword('')
                setPassword('')
                setConfirmPassword('')
            }).catch(err => {
                dispatch({type: "SHOW_ALERT", payload: err.response.data.messageBag})
            })
        } else {
            confirmPasswordField.setCustomValidity('Password must be matching.');
        }
    }

    const destroy = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be reversed',
            icon: 'warning',
            confirmButtonText: 'Yes',
            showCancelButton: true,
        }).then(result => {
            if (result.isConfirmed) {
                destroyAccountService().then(res => {
                    localStorage.setItem('token', null)
                    window.location.reload()
                })
            }
        })
    }

    return (
        <div className=" pb-14 mt-16 grid grid-cols-1">
            <div className="w-11/12 sm:w-96 place-self-center">
                <div>
                    <h1 className="pt-5 text-center text-3xl font-extrabold text-gray-900">
                        Update account details
                    </h1>
                </div>
                <form className="mt-8 space-y-6" action="" method="POST" onSubmit={e => e.preventDefault()}>
                    <Input name={'email'} type={'text'} value={email} onChange={event => setEmail(event.target.value)}/>
                    <Input name={'first_name'} type={'text'} value={firstName}
                           required={true} onChange={event => setFirstName(event.target.value)}/>
                    <Input name={'last_name'} type={'text'} value={lastName}
                           required={true} onChange={event => setLastName(event.target.value)}/>
                    <Button onClick={updateAccount} label={'Update'}/>
                </form>
                <form className="mt-8 space-y-6" action="" method="POST" onSubmit={e => e.preventDefault()}>
                    <Input name={'old_password'} type={'password'} value={oldPassword}
                           onChange={event => setOldPassword(event.target.value)}/>
                    <Input name={'password'} type={'password'} value={password}
                           onChange={event => setPassword(event.target.value)}/>
                    <Input name={'confirm_password'} type={'password'} value={confirmPassword}
                           onChange={event => setConfirmPassword(event.target.value)}/>
                    <Button onClick={updatePassword} label={'Update password'}/>
                </form>
                <Button onClick={destroy} label={'Remove account and all activity'} customClass={'mt-3'} customColor={'bg-red-600 hover:bg-red-700'}/>
            </div>
        </div>
    )
}

export default Account
