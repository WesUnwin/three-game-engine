import runDemo1 from "./1_HelloWorld";
import runDemo2 from "./2_Creating_GameObjects";
import runDemo3 from "./3_Moving_GameObjects";
import runDemo4 from "./4_GameObject_Physics";
import runDemo5 from "./5_First_Person_KinematicCharacterController";
import runDemo6 from "./6_Third_Person_KinematicCharacterController";
import runDemo7 from "./7_UserInterfaces";

const demos = [
    { name: '1. Hello World!', run: runDemo1 },
    { name: '2. Creating Game Objects', run: runDemo2 },
    { name: '3. Moving Game Objects', run: runDemo3 },
    { name: '4. GameObject Physics', run: runDemo4 },
    { name: '5. First Person CharacterController', run: runDemo5 },
    { name: '6. Third Person CharacterController', run: runDemo6 },
    { name: '7. User Interfaces', run: runDemo7 }
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
