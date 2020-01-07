import { key, serverToken } from "./config.js"

let linkPart1 = 'https://api.trello.com/1/';
let main = document.getElementById('main')
let boardId = '';
let boardBackground = '';
let cardId = '';
let lists = '';
let counter = 0;
let boards = '';

refreshDom();
//----------------------Board Dom--------------------
function refreshDom() {
    getData().then(data => {
        if (main.hasChildNodes()) {
            main.innerHTML = ' ';
        }
        const dummyArray = data;
        var boardAreaTitle = document.createElement('div');
        boards = document.createElement('div');
        boards.id = 'board-area';
        for (let board of dummyArray) {
            updatingBoards(board);
        }
        var createBoardDiv = document.createElement('div');
        // console.log(createBoardDiv);
        var createform = document.createElement('form');
        var createBoardtxt = document.createElement('input');
        createBoardtxt.type = 'text';
        createBoardtxt.className = 'boardname';
        createform.id = 'form';
        createform.className = 'hide';
        // console.log(createform);
        createBoardDiv.onclick = function () {
            document.getElementById('form').className = "show";
        };
        createBoardDiv.textContent = 'Create New Board';
        createBoardDiv.className = 'board-box create-box';
        createBoardDiv.addEventListener('submit', addBoard);
        createform.appendChild(createBoardtxt);
        createBoardDiv.appendChild(createform);
        boards.appendChild(createBoardDiv);
        main.appendChild(boards);
    });
}


function updatingBoards(newBoard) {

    var boardDiv = document.createElement('div');
    boardDiv.className = 'board-box';
    boardDiv.id = newBoard.id;
    var boardText = document.createElement('h3');
    boardText.appendChild(document.createTextNode(newBoard.name));
    boardText.className = 'board-title';
    boardDiv.appendChild(boardText);
    boardDiv.addEventListener('click', openBoard);
    boards.appendChild(boardDiv);
    main.appendChild(boards);
}

//------------------------------List DOM----------------

function refreshListDom(id) {
    //console.log(event);
    boardId = id;

    getLists(id).then(data => {
        if (main.hasChildNodes()) {
            main.innerHTML = ' ';
        }
        getSingleCard(boardId).then(data => {
            console.log(data)
            boardBackground = data.prefs.backgroundImage;
            document.body.style.backgroundImage = `url(${boardBackground})`;
        });
        lists = document.createElement('div');
        lists.id = 'list-area';
        console.log(data);
        for (let list of data) {
            updatingLists(list);
        }
        let createListDiv = document.createElement('div');
        let createform = document.createElement('form');
        let createListtxt = document.createElement('input');
        createListtxt.type = 'text';
        createListtxt.className = 'listname';
        createform.id = 'enterNewList';
        createform.className = 'hide';
        // console.log(createform);
        createListDiv.onclick = function () {
            document.getElementById('enterNewList').className = "show";
        };
        createListDiv.textContent = '+ Add another list';
        createListDiv.className = 'list-box create-list list-column';
        createListDiv.addEventListener('submit', addList);
        createform.appendChild(createListtxt);
        createListDiv.appendChild(createform);
        lists.appendChild(createListDiv);
        main.appendChild(lists);
    })
}
//---------------------------------Card DOM-------------
function refreshCardDom(id) {
    //cardId = document.getElementById(event.srcElement.parentElement.id)
    cardId = id;
    // console.log(cardId.firstElementChild.textContent);
    getCheckList(cardId).then(data => {
        console.log(data);
        getCard(cardId).then(data1 => {
            console.log(data1);
            let modalDiv = document.createElement('div');
            let modalDivtitle = document.createElement('h3');
            let descriptionBox = document.createElement('div');
            let description = document.createElement('h4')
            let descTextarea = document.createElement('textarea');
            descTextarea.className = 'description-area';
            descTextarea.textContent = data1.desc;
            let createCheckListdiv = document.createElement('div');
            let createCheckList = document.createElement('button');
            // descTextarea.rows = '2';
            // descTextarea.className = 'divtextArea';
            modalDivtitle.textContent = name;
            description.appendChild(document.createTextNode('Description'));
            modalDivtitle.appendChild(document.createTextNode(data1.name));
            descriptionBox.appendChild(description);
            descriptionBox.appendChild(descTextarea);
            modalDiv.appendChild(modalDivtitle);
            modalDiv.appendChild(descriptionBox);
            createCheckList.onclick = function () { createNewChecklist() };
            createCheckList.textContent = 'Create List';
            createCheckList.id = cardId;
            createCheckListdiv.appendChild(createCheckList);
            modalDiv.appendChild(createCheckListdiv);
            document.getElementById("modal-card").appendChild(modalDiv);
            if (data.length) {
                for (let item of data) {
                    console.log(item);
                    updatingCard(item);
                }
            }
        })
    })
}

//---------------------------- List functions ---------------------------
function updatingLists(list) {
    let listDiv = document.createElement('div');
    let listTitle = document.createElement('div');
    let listCards = document.createElement('div');
    listCards.className = 'list-card-area';
    listDiv.className = 'list-column';
    listTitle.className = 'list-title';
    listDiv.id = list.id;
    listTitle.appendChild(document.createTextNode(list.name));
    listDiv.appendChild(listTitle);
    for (let card of list.cards) {
        // console.log(card);
        let listCard = document.createElement('div');
        listCard.id = card.id;
        listCard.className = 'cards';
        let listCardtxt = document.createElement('div');
        listCardtxt.textContent = card.name;
        listCardtxt.className = "cardName";
        listCard.appendChild(listCardtxt);
        listCardtxt.addEventListener('click', openCard);
        let btnDiv = document.createElement('div');
        btnDiv.className = 'divBtn';
        let delBtn = document.createElement('button');
        let editBtn = document.createElement('button');
        editBtn.onclick = function () { editCard() };
        delBtn.onclick = function () { delCard() };
        editBtn.id = listCard.id;
        delBtn.id = listCard.id;
        delBtn.appendChild(document.createTextNode('X'));
        editBtn.appendChild(document.createTextNode('edit'));
        btnDiv.appendChild(delBtn);
        btnDiv.appendChild(editBtn);
        listCard.appendChild(btnDiv);
        listCards.appendChild(listCard);
    }
    listDiv.appendChild(listCards);
    let createListDiv = document.createElement('div');
    let createform = document.createElement('form');
    let createListtxt = document.createElement('input');
    createListtxt.type = 'text';
    createListtxt.className = 'listname';
    createform.id = counter;
    // console.log(createform.id);
    createform.className = 'hide';
    createListDiv.onclick = function () {
        document.getElementById(createform.id).className = "show";
    };
    createListDiv.blur = function () {
        document.getElementById(createform.id).className = "hide";
    }
    createListDiv.textContent = '+ Add Card';
    createListDiv.className = 'list-box create-list';
    createListDiv.addEventListener('submit', addCard);
    // createListDiv.id = list.id;
    createform.appendChild(createListtxt);
    createListDiv.appendChild(createform);
    listDiv.appendChild(createListDiv);
    lists.appendChild(listDiv);
    main.appendChild(lists);
    counter++;
}


function addList() {
    event.preventDefault()
    // event.stopPropagation()
    console.log(event);
    console.log(boardId);
    console.log(event.target.firstChild.value);
    console.log(event.srcElement.parentElement)
    // event.srcElement.parentElement.style.display = 'none';
    postLists(boardId, event.target.firstChild.value);
}

function addCard() {
    event.preventDefault();
    //event.stopPropagation();
    postCard(event.target.parentElement.parentElement.id, event.target.firstChild.value);
}

function updateCard() {
    event.preventDefault();
    event.stopPropagation();
    console.log(event);
    putCard(event.target.previousSibling.id, event.srcElement[0].value);
}

function delCard() {
    console.log(event);
    event.stopPropagation();
    deleteCard(event.srcElement.id);
}

function editCard() {
    console.log(event);
    // event.stopPropagation();
    const editFormLayout = event.target.parentNode;
    console.log(editFormLayout.parentElement.id);
    const editTheForm = document.createElement("form");
    const editButton = document.getElementById(editFormLayout.lastElementChild.id);
    editButton.className = 'show';
    let inputDiv = document.createElement('div');
    const inputText = document.createElement("input");
    inputText.type = "text";
    inputText.placeholder = "Edit text";
    inputText.id = "edit-item";
    inputText.className = 'listname';
    inputDiv.appendChild(inputText);
    editTheForm.appendChild(inputDiv);
    editFormLayout.appendChild(editTheForm);
    editTheForm.addEventListener('submit', updateCard);
}

function openCard() {
    console.log(event)
    console.log(event.srcElement.parentElement.id);
    console.log(cardId);
    // Get the modal
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    // When the res=> return res;=> return res; clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            clear();
        }
    }
    refreshCardDom(event.srcElement.parentElement.id);
}



//----------------------------Card Checklist Functions -----------------------------------

function updatingCard(item) {
    //console.log(item);
    let modalDiv = document.createElement('div');
    let checklists = document.createElement('div');

    let buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'checklist-buttons';
    let addCheckListdiv = document.createElement('div');
    let addChecklist = document.createElement('button');
    addChecklist.onclick = function () { createCheckListitem() };
    addChecklist.textContent = 'Add Task';
    addChecklist.id = item.id;
    addCheckListdiv.appendChild(addChecklist);

    let delCheckListdiv = document.createElement('div');
    let deleteCheckList = document.createElement('button');
    deleteCheckList.onclick = function () { deleteCheckListitem() };
    deleteCheckList.textContent = 'Delete List';
    deleteCheckList.id = item.id;
    delCheckListdiv.appendChild(deleteCheckList);

    checklists.id = item.idCard;
    let checklistTitle = document.createElement('h4');
    checklistTitle.textContent = item.name;
    let checklistul = document.createElement('ul');
    checklistul.id = item.id;
    for (let checklistitem of item.checkItems) {
        let deleteItem = document.createElement('button');
        deleteItem.onclick = function () { delCheckListitem() };
        deleteItem.textContent = 'Delete Task';
        deleteItem.id = checklistitem.idChecklist;
        //console.log(checklistitem.id)
        deleteItem.setAttribute('itemId', checklistitem.id)
        //  console.log(checklistitem);
        let checklistli = document.createElement('li');
        checklistli.className = 'taskList';
        checklistli.id = checklistitem.id;
        checklistli.style.listStyleType = 'none';
        let checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.id = checklists.id;
        checkBox.addEventListener('click', toggleStatus);
        let checklistliText = document.createElement('span');
        checklistliText.textContent = checklistitem.name;
        if (checklistitem.state === 'complete') {
            checkBox.checked = true;
            checklistliText.style.textDecoration = "line-through";
        }
        else {
            checkBox.checked = false;
            checklistliText.style.textDecoration = "none";
        }
        checklistli.appendChild(checkBox);
        checklistli.appendChild(checklistliText);
        checklistli.appendChild(deleteItem);
        checklistul.appendChild(checklistli);
    }
    buttonsDiv.appendChild(addCheckListdiv);
    //  buttonsDiv.appendChild(deleteDiv);
    buttonsDiv.appendChild(delCheckListdiv);
    checklistul.appendChild(buttonsDiv);
    checklists.appendChild(checklistTitle);
    checklists.appendChild(checklistul);
    modalDiv.appendChild(checklists);
    document.getElementById("modal-card").appendChild(modalDiv);
}

function createCheckListitem() {
    console.log(event);
    event.target.style.display = 'none';
    let addChecklistitem = document.createElement("form");
    addChecklistitem.id = event.srcElement.id;
    let inputText = document.createElement("input");
    inputText.type = "text";
    inputText.placeholder = "Add task";
    inputText.className = "show";
    addChecklistitem.appendChild(inputText);
    addChecklistitem.addEventListener('submit', addTask);
    event.target.parentNode.appendChild(addChecklistitem);
}

function createNewChecklist() {
    console.log(event);
    let addChecklist = document.createElement("form");
    addChecklist.id = event.srcElement.id;
    let inputText = document.createElement("input");
    inputText.type = "text";
    inputText.placeholder = "New CheckList Name";
    inputText.className = "show";
    addChecklist.appendChild(inputText);
    addChecklist.addEventListener('submit', addNewCheckList);
    event.target.parentNode.appendChild(addChecklist);
}

function addNewCheckList() {
    event.preventDefault();
    //event.stopPropagation();
    postCheckList(event.srcElement.id, event.srcElement.firstElementChild.value);

}
function toggleStatus() {
    event.stopPropagation();
    console.log(event.srcElement.id);
    console.log(event.srcElement.parentElement.id);
    console.log(event);
    checkItemStatus(event.srcElement.parentElement.id, event.srcElement.checked, event.srcElement.id);
}

function addTask() {
    event.preventDefault();
    postCheckListtask(event.srcElement.id, event.srcElement.firstElementChild.value);
}

function deleteCheckListitem() {
    console.log(event);
    event.preventDefault();
    event.stopPropagation();
    delCheckList(event.srcElement.id);
}

//---------------------------------- Requests area ---------------------------
function getLists(id) {
    let url = `${linkPart1}boards/${id}/lists?cards=open&card_fields=name&filter=open&fields=name&key=${key}&token=${serverToken}`;
    return fetch(url).then(data => data.json()).then(res => { return res; });
}

function postLists(id, name) {
    let url = `${linkPart1}boards/${id}/lists?name=${name}&key=${key}&token=${serverToken}`
    return fetch(url, { method: 'POST' }).then(data => data.json()).then(res => refreshListDom(id));
}

function getCard(id) {
    let url = `${linkPart1}cards/${id}?attachments=false&attachment_fields=all&members=false&membersVoted=false&checkItemStates=false&checklists=none&checklist_fields=all&board=false&list=false&pluginData=false&stickers=false&sticker_fields=all&customFieldItems=false&key=${key}&token=${serverToken}`;
    return fetch(url).then(data => data.json()).then(res => { return res; });
}

function postCard(id, name) {
    let url = `${linkPart1}cards?idList=${id}&keepFromSource=all&key=${key}&token=${serverToken}&name=${name}`;
    return fetch(url, { method: 'POST' }).then(data => data.json()).then(res => refreshListDom(boardId));
}
function deleteCard(id) {
    let url = `${linkPart1}cards/${id}?key=${key}&token=${serverToken}`;
    return fetch(url, { method: 'DELETE' }).then(data => data.json()).then(res => refreshListDom(boardId));
}
function putCard(id, name) {
    url = `${linkPart1}cards/${id}?name=${name}&key=${key}&token=${serverToken}`
    return fetch(url, { method: 'PUT' }).then(data => data.json()).then(res => {
        console.log(res)
        refreshListDom(boardId);
    });
}

function getCheckList(id) {
    let url = `${linkPart1}cards/${id}/checklists?checkItems=all&checkItem_fields=name%2CnameData%2Cpos%2Cstate&filter=all&fields=all&key=${key}&token=${serverToken}`;
    return fetch(url).then(data => data.json()).then(res => { return res; });
}


function postCheckList(id, name) {
    let url = `${linkPart1}checklists?idCard=${id}&name=${name}&key=${key}&token=${serverToken}`;
    return fetch(url, { method: 'POST' }).then(data => data.json()).then(res => {
        clear();
        refreshCardDom(cardId)
    });
}

function postCheckListtask(id, name) {
    let url = `${linkPart1}checklists/${id}/checkItems?name=${name}&pos=bottom&checked=false&key=${key}&token=${serverToken}`;
    return fetch(url, { method: 'POST' }).then(data => data.json()).then(res => {
        clear();
        refreshCardDom(cardId)
    });
}

function delCheckList(id) {
    let url = `${linkPart1}checklists/${id}?key=${key}&token=${serverToken}`;
    return fetch(url, { method: 'DELETE' }).then(data => data.json()).then(res => {
        clear();
        refreshCardDom(cardId);
    });
}

function checkItemStatus(itemId, checked, cardId) {
    let status = '';
    if (checked === true) {
        status = 'complete';
    }
    else {
        status = 'incomplete';
    }
    let url = `${linkPart1}cards/${cardId}/checkItem/${itemId}?state=${status}&key=${key}&token=${serverToken}`;
    console.log(url);
    return fetch(url, { method: 'PUT' }).then(data => data.json()).then(res => {
        clear();
        refreshCardDom(cardId);
    });
}


function addBoard(e) {
    //e.preventDefault();
    console.log('here');
    console.log(e.target.firstChild.value);
    postData(e.target.firstChild.value);
}

function openBoard() {
    console.log(event.srcElement.id);
    //refreshListDom();
    boardId = event.srcElement.id;
    //getLists()
    refreshListDom(boardId);
}
//------------------------------------------request functions


function getData() {
    let getUrl = `${linkPart1}members/prakharshukla5/boards?key=${key}&token=${serverToken}`;
    return fetch(getUrl, {
        method: 'GET'
    }).then(data => {
        if (data.ok) {
            return data.json();
        }
    }).then(res => {
        return res;
    });
}


function postData(name) {
    let postUrl = `${linkPart1}boards/?name=${name}&key=${key}&token=${serverToken}`;

    return fetch(postUrl, { method: 'POST' }).then(data => {
        if (data.ok) {
            return data.json();
        }
    }).then(res => {
        refreshDom();
    });
}

function clear() {
    if (document.getElementById("modal-card").hasChildNodes()) {
        document.getElementById("modal-card").innerHTML = ' ';
    }
}
function delCheckListitem() {
    console.log(event.srcElement.id);
    console.log(event.srcElement.attributes.itemId.value);
    deleteTask(event.srcElement.id, event.srcElement.attributes.itemId.value)
}
function getSingleCard(id) {
    let url = `${linkPart1}boards/${id}?actions=all&boardStars=none&cards=none&card_pluginData=false&checklists=none&customFields=false&fields=name%2Cdesc%2CdescData%2Cclosed%2CidOrganization%2Cpinned%2Curl%2CshortUrl%2Cprefs%2ClabelNames&lists=open&members=none&memberships=none&membersInvited=none&membersInvited_fields=all&pluginData=false&organization=false&organization_pluginData=false&myPrefs=false&tags=false&key=${key}&token=${serverToken}`;
    return fetch(url).then(data => data.json()).then(res => { return res; })
}

function deleteTask(listId, itemId) {
    let url = `${linkPart1}checklists/${listId}/checkItems/${itemId}?key=${key}&token=${serverToken}`;
    //  console.log(url);
    return fetch(url, { method: 'DELETE' }).then(data => data.json()).then(res => {
        clear();
        refreshCardDom(cardId)
    })

}