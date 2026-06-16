const form = document.getElementById('registrationForm');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confpassword = document.getElementById('confpassword');
const male = document.getElementById('male');
const female = document.getElementById('female');
const dob = document.getElementById('dob');

function validate(event) {
    event.preventDefault(); 
    
    let isValid = true;

    document.querySelectorAll('.error-text').forEach(el => el.innerText = "");
    document.querySelectorAll('input').forEach(input => input.classList.remove('invalid', 'valid'));

    if (username.value.trim().length < 5) {
        document.getElementById('username-error').innerText = "❌ Username harus berisi minimal 5 karakter.";
        username.classList.add('invalid');
        isValid = false;
    } else {
        username.classList.add('valid');
    }


    if (!email.value.toLowerCase().endsWith('@gmail.com')) {
        document.getElementById('email-error').innerText = "❌ Email wajib berakhiran dengan @gmail.com";
        email.classList.add('invalid');
        isValid = false;
    } else {
        email.classList.add('valid');
    }


    if (password.value.length < 1) {
        document.getElementById('password-error').innerText = "❌ Password tidak boleh kosong.";
        password.classList.add('invalid');
        isValid = false;
    } else {
        password.classList.add('valid');
    }

    if (password.value !== confpassword.value || confpassword.value.length < 1) {
        document.getElementById('confpassword-error').innerText = "❌ Konfirmasi password tidak cocok.";
        confpassword.classList.add('invalid');
        isValid = false;
    } else {
        confpassword.classList.add('valid');
    }


    if (!male.checked && !female.checked) {
        document.getElementById('gender-error').innerText = "❌ Silakan pilih jenis kelamin Anda.";
        isValid = false;
    }


    if (!dob.value) {
        document.getElementById('dob-error').innerText = "❌ Tanggal lahir wajib diisi.";
        dob.classList.add('invalid');
        isValid = false;
    } else {
        dob.classList.add('valid');
    }

    if (isValid) {
        let konfirmasi = confirm("Apakah Anda yakin data yang dimasukkan sudah benar?");
        if (konfirmasi) {
            alert("🎉 Pendaftaran Berhasil! Selamat bergabung di komunitas V-Phone.");
            form.reset(); 
            document.querySelectorAll('input').forEach(input => input.classList.remove('valid'));
        }
    }
}

form.addEventListener('submit', validate);


const navbarNav = document.querySelector('.navbar-nav');
const hamburger = document.querySelector('#hamburger-menu');

hamburger.onclick = (e) => {
    navbarNav.classList.toggle('active');
    e.preventDefault();
};

document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
        navbarNav.classList.remove('active');
    }
});