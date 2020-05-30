// import checkNumInputs from "./checkNumInputs";

const forms = () => {
	//получаем элементы форм
	const form = document.querySelectorAll('form');
	const input = document.querySelectorAll('input');
	const upload = document.querySelectorAll('[name="upload"]');
	//ввод только цифр в поле с телефоном
	// checkNumInputs('input[name="user_phone"]');
	//создаем объект с сообщениями пользователю
	const message = {
		loading:'Загрузка....' ,
		success:'Спасибо! Скоро мы с вами свяжемся' ,
		failure:'Что-то пошло не так...',
		spinner: 'assets/img/spinner.gif',
		ok: 'assets/img/ok.png',
		fail: 'assets/img/fail.png'
	};

	const path = {
		designer: 'assets/server.php',
		question: 'assets/question.php'
	};

	//создаем функцию отправки сообщений на сервер
	const postData = async(url , data) => {
		let res = await fetch(url , {
			method:'POST' ,
			body:data
		});
		return await res.text();
	};
	//очищаем инпуты
	const clearInputs = () => {
		input.forEach(item => {
			item.value = '';
		});
		upload.forEach(item =>{
			item.previousElementSibling.textContent = 'Файл не выбран';
		});
	};

	upload.forEach(item =>{
		item.addEventListener('input', ()=>{
			console.log(item.files[0]);
			let dots;
			const arr = item.files[0].name.split('.');
			arr[0].length > 6 ? dots = '...' : dots = '.';
			const name = arr[0].substring(0, 6) + dots + arr[1];
			item.previousElementSibling.textContent = name;
		})
	});

	//работаем с формами
	form.forEach(item => {
		item.addEventListener('submit' , (evt) => {
			evt.preventDefault();
			//выводим сообщение пользователю
			let statusMessage = document.createElement('div');
			statusMessage.classList.add('status');
			item.parentNode.appendChild(statusMessage);

			item.classList.add('animated', 'fadeOutUp');
			setTimeout(() =>{
				item.style.display = 'none';
			}, 400);

			let statusImg = document.createElement('img');
			statusImg.setAttribute('scr', message.spinner);
			statusImg.classList.add('animated', 'fadeInUp');
			statusMessage.appendChild(statusImg);


			let textMessage = document.createElement('div');
			textMessage.textContent = message.loading;
			statusMessage.appendChild(textMessage);
			//собираем все данные из формы
			const formData = new FormData(item);
			let api;
			item.closest('.popup-design') || item.classList.contains('calc_form') ? api = path.designer : api = path.question;
			console.log(api);
			//отправляем сообщение на сервер
			postData(api , formData)
				.then(res => {
					console.log(res);
					statusImg.setAttribute('src', message.ok);
					textMessage.textContent = message.success;
				})//отлавливаем события ошибки
				.catch(() => {
					statusImg.setAttribute('src', message.fail);
					textMessage.textContent = message.failure;
				})
				.finally(() => {//убираем сообщение пользователю
					clearInputs();
					setTimeout(() => {
						statusMessage.remove();
						item.style.display = 'block';
						item.classList.remove('fadeOutUp');
						item.classList.add('fadeInUp');
					} , 5000);
				})
		});
	});
};
export default forms;