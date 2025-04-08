type FormData = {
        password: string;
        email: string;
}

export async function loginForm(data: FormData) {
    const username = data.email;
    const password = data.password;
    const response = await fetch('https://zone01normandie.org/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${username}:${password}`),
        },
        
    })

    if (response.ok) {
        const res = await response.json();
        return res;
    } else {
        return false;
    }
}