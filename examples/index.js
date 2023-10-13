import runDemo1 from "./1_HelloWorld";

const demos = [
    { name: '1. Hello World!', run: runDemo1 }
];

demos.forEach(demo => {
    const button = document.createElement('button');
    button.textContent = demo.name;
    button.addEventListener('click', () => {
        document.body.innerHTML = '';
        demo.run();
    });
    document.body.appendChild(button);
});
