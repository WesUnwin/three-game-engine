import runFirstPersonCharacterController from "./first_person_character_controller/runDemo";

const demos = [
    { name: 'First Person CharacterController', run: runFirstPersonCharacterController },
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
