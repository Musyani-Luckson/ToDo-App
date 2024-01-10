
import { Utilities } from "../modules/utilities.js"
const utilities = new Utilities();

class ToDo {
    #myForm = utilities.getDom(`#myForm`);
    #maxTodos = utilities.getDom(`#maxTodos`);
    #form = utilities.getDom(`#inputData`);
    #toDosBox = utilities.getDom(`#toDos`);
    //
    #myToDos = [{}];
    #KEY = `myToDos`;
    //
    #toDosSize() {
        return utilities.getProps(this.#myToDos[0], `keys`).length;
    };
    //
    #reloadRecords() {
        if (localStorage.getItem(this.#KEY) == null) {
            utilities.browserStorageUse(`post`, this.#KEY, localStorage);
        }
        this.#myToDos = utilities.browserStorageUse(`get`, this.#KEY, localStorage);
        utilities.setInnerText(this.#maxTodos, `${this.#toDosSize()} Todos`);
        this.#displayToDos();
    };
    //
    #saveRcords() {
        utilities.browserStorageUse(`delete`, this.#KEY, localStorage)
        utilities.browserStorageUse(`post`, this.#KEY, localStorage, this.#myToDos[0])
    };
    //
    #id(items) {
        const ID = utilities.idGenerator();
        if (items[ID] == undefined) {
            return ID;
        } else {
            this.#id(items);
        }
    }
    //
    #addToDos(value) {
        const ID = this.#id(this.#myToDos[0]);
        const DATA = {
            text: value,
            id: ID,
            timeStamp: new Date().toString()
        };
        this.#myToDos[0][ID] = DATA;
    }
    //
    #handleAddBtn() {
        utilities.handleEvent(this.#myForm, `submit`, event => {
            event.preventDefault();
            const formData = new FormData(this.#myForm)
            const VALUE = formData.get(`todo`).trim();
            if (VALUE == "" && VALUE.length == 0) {
                alert("CANNOT SET NOTHING TO DO")
            } else {
                this.#form.value = ``;
                this.#addToDos(VALUE);
                this.#saveRcords();
                this.#reloadRecords();
            }
        })
    };
    //
    #displayToDos() {
        const TODOS = utilities.getProps(this.#myToDos[0], `values`)
        utilities.removeElement(this.#toDosBox)
        const parent = utilities.setDom(`div`, {
            class: `parent`,
        })
        for (let i = 0; i < TODOS.length; i++) {
            const CARD = this.#toDoCard(TODOS[i]);
            parent.appendChild(CARD.outerComp);
            this.#manageRecords(i, CARD)
        }
        this.#toDosBox.appendChild(parent);
    };
    //
    #toDoCard(data) {
        const rightBtnComp = utilities.setDom(`button`, {
            class: `border`,
            value: `delete`,
            data: {
                text: `DELETE`
            }
        })
        // 
        const leftBtnComp = utilities.setDom(`button`, {
            class: `border`,
            value: `edit`,
            data: {
                text: `EDIT`
            }
        })
        // 
        const leftComp = utilities.setDom(`input`, {
            class: `form-control border`,
            type: `text`,
            disabled: true
        })
        leftComp.value = data.text;
        // 
        const outerComp = utilities.setDom(`li`, {
            class: `input-group rounded item`,
            data: {
                append: [
                    leftComp,
                    leftBtnComp,
                    rightBtnComp
                ]
            }
        })
        // 
        return {
            outerComp,
            leftBtn: leftBtnComp,
            rightBtn: rightBtnComp,
            form: leftComp,
            id: data.id
        };
    }
    //
    #back(card) {
        card.form.disabled = true;
        utilities.setInnerText(card.leftBtn, `EDIT`);
        card.leftBtn.value = `edit`;
        utilities.setInnerText(card.rightBtn, `DELETE`);
        card.rightBtn.value = `delete`;
    }
    //
    #manageRecords(index, card) {
        utilities.handleEvent(card.leftBtn, `click`, (event) => {
            const VALUE = card.leftBtn.value;
            if (VALUE == `edit`) {
                card.form.disabled = false;
                utilities.setInnerText(card.leftBtn, `UPDATE`);
                card.leftBtn.value = `update`;
                utilities.setInnerText(card.rightBtn, `BACK`);
                card.rightBtn.value = `back`;
            } else {
                const FORM_VALUE = card.form.value;
                this.#back(card);
                this.#myToDos[0][card.id].text = FORM_VALUE;
                this.#saveRcords();
            }
        })
        //
        utilities.handleEvent(card.rightBtn, `click`, () => {
            const VALUE = card.rightBtn.value;
            if (VALUE == `delete`) {
                delete this.#myToDos[0][card.id];
                this.#saveRcords();
                this.#reloadRecords();
            } else {
                this.#back(card);
                card.form.value = this.#myToDos[0][card.id].text;
            }
        })
    }
    //
    run() {
        this.#reloadRecords();
        this.#handleAddBtn();
    };
}
const TODOS = new ToDo()
TODOS.run();

