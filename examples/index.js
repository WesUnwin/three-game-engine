import runDemo1 from "./1_HelloWorld";
import runDemo2 from "./2_Creating_GameObjects";
import runDemo3 from "./3_Moving_GameObjects";

const demos = [
    { name: '1. Hello World!', run: runDemo1 },
    { name: '2. Creating Game Objects', run: runDemo2 },
    { name: '3. Moving Game Objects', run: runDemo3 }
];

const desc = document.createElement('p');
desc.innerHTML = 'Welcome to the examples page! <br /> Please build the library by running "npm run build" first, repeat this if making src code changes. <br /> Then run this page via: "npm run examples".'
document.body.appendChild(desc);

demos.forEach(demo => {
    const button = document.createElement('button');
    button.textContent = demo.name;
    button.addEventListener('click', () => {
        document.body.innerHTML = '';
        demo.run();
    });
    document.body.appendChild(button);
});
