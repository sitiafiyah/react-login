import './App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function App() {
    const initialValues = { username: "", password: "" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const [isLogged, setIsLogged] = useState(false);
    const [invalidLogin, setInvalidLogin] = useState(0);
    const [isSuspend, setIsSuspend] = useState(false);
    const [suspendTime, setSuspendTime] = useState(10);
    const [loggedTime, setLoggedTime] = useState(0);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true)
        if (isSubmit) {
            setIsLogged(true);
        }
    };

    const handleStop = () => {
        setIsLogged(false);
        setLoggedTime(0);
    };

    useEffect(() => {
        if (isSuspend) {
            suspendTime > 0 && setTimeout(() => setSuspendTime(suspendTime - 1), 1000);
            if (suspendTime === 0) {
                setIsSuspend(false)
                setInvalidLogin(0)
            }
        }

        if (isLogged) {
            loggedTime >= 0 && setTimeout(() => setLoggedTime(loggedTime + 1), 1000)
            if (loggedTime >= 30) {
                setIsLogged(false)
            }
        }
    }, [formErrors, suspendTime, loggedTime, isSuspend]);

    const validate = (values) => {
        const errors = {};
        const adminUser = {
            username: "siti.afiyah",
            password: "password1"
        };

        //field validation
        if (!values.username) {
            errors.username = "Username is required!";
        }
        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 4) {
            errors.password = "Password must be more than 4 characters";
        } else if (values.password.length > 10) {
            errors.password = "Password cannot exceed more than 10 characters";
        }

        //invalid login validation
        if (values.username && values.password) {
            if (values.username !== adminUser.username && values.password !== adminUser.password) {
                errors.invalidAccount = "Invalid account";
                setInvalidLogin(invalidLogin + 1)
            }
        }

        if (invalidLogin >= 2) {
            setIsSuspend(true)

        }

        return errors;
    };

    return (
        <div className="container">
            {
                !isLogged && loggedTime >= 30 &&
                <div className="row">
                    <div className="card">
                        <div className="card-body">
                            <h4> Session Ended </h4>
                            <span>
                                There was no activity for a while so we closed the session.
                            </span>
                        </div>
                        <div className="card-body">
                            <button className="btn btn-primary" onClick={handleStop}> Stop </button>
                        </div>
                    </div>

                </div>
            }
            {
                isSubmit && isLogged && loggedTime <= 30 &&
                <div className="row">
                    <div className="alert alert-success">Signed in successfully !!</div>
                    <div className="card">
                        <div className="card-body">
                            <h1>Welcome, {formValues.username}</h1>
                        </div>
                    </div>
                </div>
            }
            {
                !isLogged && loggedTime < 30 &&
                <form onSubmit={handleSubmit}>
                    <h1>Login Form</h1>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text"
                            className="form-control"
                            name="username"
                            placeholder="Username"
                            value={formValues.username}
                            onChange={handleChange}
                        />
                        <p>{formErrors.username}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control"
                            name="password"
                            placeholder="Password"
                            value={formValues.password}
                            onChange={handleChange} />
                        <p>{formErrors.password}</p>
                    </div>
                    <p>{formErrors.invalidAccount}</p>
                    <button type="submit" className="btn btn-primary" disabled={isSuspend}>{isSuspend ? <span> Please wait {suspendTime}s</span> : <span>Log In</span>}</button>
                </form>
            }
        </div>
    )
}

