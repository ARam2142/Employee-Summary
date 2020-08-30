//classes
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

//npm installs
const open = require('open');
const inquirer = require("inquirer");//questions for the inquirer
const path = require("path");
const fs = require("fs");//fs to writefile to  html

//output paths
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

//array contains all employee objects
const teamArray = [];

const createTeam = () => {
    const choices = ["Manager", "Engineer", "Intern"]
    if(teamArray.length > 0){
        //works cited worked on with tutor(const choices and if statement)
        choices.push('End');
    }
    inquirer.prompt([
    {
        type: "list",
        name: "teamMember",
        message: 'what team members would you like to add?',
        choices
    },
    ]).then(choice => {
        console.log(choice)
        if(choice.teamMember === 'End'){
            //Build html here
            console.log('BUild html')
            console.log(teamArray)
            buildTeam();
            return;

        }
        switch (choice.teamMember) {
            case 'Manager':
                createManager();
                break;
            case 'Engineer':
                createEngineer();
                break;
            case 'Intern':
                createIntern();
                break;
            default:
                //worked on with tutor
                throw new Error('This should never happen dropdown did not give proper response');
        }
    })
    .catch(err => console.log(err))
}

//have user input answers to manager
const createManager = () => {
    console.log("You must create a team")
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: 'what is the name of your manager?',
            validate: (name) => {
                if (name === null || name.length < 3) {
                    console.log(" your name must be longer than 3 letters")
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            name: "id",
            message: "what is the manager's id?",
            validate: (id) => {
                if (id) {
                    return true;
                } else {
                    console.log('you must enter a valid id');

                }
            }
        },
        {
            type: "input",
            name: "email",
            message: "what is your manager's email",
            validate: (email)  => {
                //works cited: https://www.codespot.org/javascript-email-validation/
                const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email.trim());
            }
        },
        {
            type: "input",
            name: "officenumber",
            message: "what is your manager's office number?",
            validate: (officenumber) => {
                const num = /^[0-50]+$/;
                if (isNaN(num)) {
                    console.log(' you must enter a number between 0 and 50');
                } 
                return num.test(officenumber);

            }

        },
    ]).then(answers => {
        console.log(answers);
        const manager = new Manager(answers.name, answers.id, answers.email, answers.officenumber);
        teamArray.push(manager);
        createTeam();
    })
}

const createEngineer = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: 'what is the name of your engineer?',
            validate: (name) => {
                if (name === null || name.length < 3) {
                    console.log("your name must be longer than 3 letters")
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            name: "id",
            message: "what is the engineer's id?",
            validate: (id) => {
                if (id) {
                    return true
                } else {
                    console.log('enter a valid id');
                }
            }
            
        },
        {
            type: "input",
            name: "email",
            message: "what is your engineer's email",
            validate: (email)  => {
                const re = /^(([^<>()\[\]\\]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
                return re.test(email);
            }
            
        },
        {
            type: "input",
            name: "github",
            message: "what is your engineer's github username?",
            validate: (github) => {
                if (github === null || github.length < 5) {
                    console.log("your github username must be longer than 5 letters")
                } else {
                    return true;
                }
            }
        },
    ]).then(answers => {
        const engineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
        teamArray.push(engineer);
        createTeam();
    })
}

const createIntern = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: 'what is the name of your intern?',
            validate: (name) => {
                if (name === null || name.length < 3) {
                    console.log("your name must be longer than 3 letters")
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            name: "id",
            message: "what is the intern's id?",
            validate: (id) => {
                if (id) {
                    return true
                } else {
                    console.log('enter a valid id')
                }
            }  
        },
        {
            type: "input",
            name: "email",
            message: "what is your intern's email",
            validate: (email)  => {
                const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email.toLowerCase().trim());
            }
        },
        {
            type: "input",
            name: "school",
            message: "what is your intern's school?",
            validate: (name) => {
                if (name === null || name.length < 6) {
                    console.log("The school must be longer than 3 letters")
                } else {
                    return true;
                }
            }
        },
    ]).then(answers => {
        const intern = new Intern(answers.name, answers.id, answers.email, answers.school);
        teamArray.push(intern);
        createTeam();
    })
}   

const buildTeam = () => {
    //You have an aray of objects
    //YOU need to popoulate a string of html
    const html = render(teamArray);
    //Then write to an html file
    fs.writeFile(outputPath, html, function(err) {
        if (err) {
            throw err;
        }

        //worked on with tutuor
        //USe npm open package to automatically open file
        open(outputPath);
    });
}

createTeam();


    
    
    
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
    
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!
