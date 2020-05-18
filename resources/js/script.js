let data = ([]);

let defaultTweets = [
    {
        id: '1',
        description: 'aaa',
        createdAt: new Date('2020-03-17T23:00:00'),
        author: 'user1',
        photoLink: 'https://www.pressball.by/images/stories/2020/03/20200310231542.jpg',
        hashTags: ['covid-19'],
        likes: ['user2']
    },
    {
        id: '2',
        description: 'bbb',
        createdAt: new Date('2020-03-21T12:58:00'),
        author: 'user2',
        hashTags: ['tag'],
        likes: []
    }
];


class Model {
    data;
    number;

    constructor() {
        let keyTweets = Object.keys(localStorage);
        this.data = [];
        if (keyTweets.length === 0) {
            data = defaultTweets;
            for (var i = 0; i < defaultTweets.length; i++) {
                this.add(defaultTweets[i]);
            }
        } else {
            for (let i = 0; i < keyTweets.length; i++) {
                try {
                    let tweet = JSON.parse(localStorage.getItem(keyTweets[i]));

                    tweet.createdAt = new Date(tweet.createdAt);

                    this.data.push(tweet);
                } catch (e) {
                    console.log('Parse JSON error');
                }
            }
        }
    }

    getPage(skip, top, filterConfig) {
        if (typeof skip !== 'number' || typeof top !== 'number') {
            console.log('Incorrect input!');
            return;
        }

        skip = skip || 0;
        top = top || 10;
        this.filterConfig = filterConfig;


        if (filterConfig) {
            let responseData = this.data;

            for (let param in filterConfig) {
                if (param === 'hashTags') {
                    for (let i = 0; i < filterConfig.hashTags.length; i++) {
                        responseData = responseData.filter(tweet => tweet.hashTags.includes(filterConfig.hashTags[i]));
                    }
                } else if (param === 'dateFrom') {
                    responseData = responseData.filter(tweet => tweet.createdAt >= filterConfig.dateFrom);
                } else if (param === 'dateTo') {
                    responseData = responseData.filter(tweet => tweet.createdAt < filterConfig.dateTo);
                } else if (param === 'author') {
                    responseData = responseData.filter(tweet => tweet.author === filterConfig.author);
                }
            }

            responseData.sort(Model.comparator_BY_DATE);
            this.number = responseData.length;
            return responseData.slice(skip, skip + top);

        } else {
            let responseData = this.data.slice(skip, skip + top);

            responseData.sort(Model.comparator_BY_DATE);

            return responseData;
        }
    }

    static comparator_BY_DATE(a, b) {
        return b.createdAt - a.createdAt;
    }
    saveToLocalStorage() {
        localStorage.setItem('tweets', JSON.stringify(this));
    }

    static restoreFromLocalStorage() {
        return new Model(JSON.parse(localStorage.getItem('tweets')).data);
    }

    get(id) {
        if (typeof id === 'string') {
            return this.data.find(tweet => tweet.id === id);
        } else {
            console.log('Incorrect type of id.');
        }
    }

    static validate(tweet, params = ['id', 'description', 'author', 'createdAt', 'photoLink', 'hashTags', 'likes']) {
        return params.every(function (param) {
            switch (param) {
                case 'id':
                    if (!tweet.id || typeof tweet.id !== 'string') {
                        return false;
                    }
                    break;
                case 'description':
                    if (!tweet.description || typeof tweet.description !== 'string' || tweet.description.length > 250) {
                        return false;
                    }
                    break;
                case 'author':
                    if (!tweet.author || typeof tweet.author !== 'string') {
                        return false;
                    }
                    break;
                case 'createdAt':
                    if (!tweet.createdAt || Object.prototype.toString.call(tweet.createdAt) !== '[object Date]') {
                        return false;
                    }
                    break;
                case 'photoLink':
                    if (tweet.photoLink && typeof tweet.photoLink !== 'string') {
                        return false;
                    }
                    break;
                case 'hashTags':
                    if (tweet.hashTags) {
                        if (!tweet.hashTags.every(tag => typeof tag === 'string')) {
                            return false;
                        }
                    }
                    break;
                case 'likes':
                    if (tweet.likes.length !== 0) {
                        if (!tweet.likes.every(like => typeof like === 'string')) {
                            return false;
                        }
                    }
                    break;
                default:
                    return false;
            }
            return true;
        });
    }

    add(tweet = {}) {
        tweet.likes = [];
        if (Model.validate(tweet)) {

            this.data.push(tweet);
            this.data.sort(Model.comparator_BY_DATE);
            let o = JSON.stringify(tweet);
            localStorage.setItem(tweet.id, o);
            return true;
        }
        return false;
    }

    edit(id, tweet) {

        if (!Model.validate(tweet, Object.keys(tweet))) {
            return false;
        }

        let editingTweet = this.get(id);

        for (let param in tweet) {
            editingTweet[param] = tweet[param];
        }
        localStorage.removeItem(id);
        localStorage.setItem(id, JSON.stringify(editingTweet));
        return true;
    }

    remove(id) {
        if (typeof id === 'string') {
            let index = this.data.findIndex(tweet => tweet.id === id);

            if (index !== -1) {
                this.data.splice(index, 1);
                localStorage.removeItem(id);
                return true;
            }
        }
        return false;
    }


    like(id = '', user = '') {
        let tweet = this.get(id);
        let index = tweet.likes.findIndex(like => like === user);
        if (index === -1) {
            tweet.likes.push(user);
            localStorage.removeItem(id);
            localStorage.setItem(id, JSON.stringify(tweet));
            return true;
        }

        return false;
    }
    dislike(id = '', user = '') {
        let tweet = this.get(id);
        let index = tweet.likes.findIndex(like => like === user);
        if (index !== -1) {
            tweet.likes.splice(index, 1);
            localStorage.removeItem(id);
            localStorage.setItem(id, JSON.stringify(tweet));
            return true;
        }

        return false;
    }
}

class View {
    mainPage;
    logPage;
    tweetTemplate;
    tweetContainer;
    currentUser;
    filterForm;
    filterName;
    filterTag;
    filterDateFrom;
    filterDateTo;
    applyFilter;
    addInW;
    plusInW;
    plusInTweets;
    addTweetButton;
    tweetPage;
    tweetText;
    tweetTags;
    tweetTextStart;
    tweetTagsStart;
    whatsInputTags;
    action;
    edit;
    like;
    userInputName;
    userInputPassword;
    whatsInput;
    ok;
    logInB;
    withoutLog;
    userName;
    logForm;
    logOutForV;
    tweet;

    constructor() {
        this.mainPage = document.getElementById('mainPage');
        this.userInputName = document.getElementById('userInputName');
        this.userInputPassword = document.getElementById('userPassword');
        this.userName = document.getElementById('userName');
        this.logPage = document.getElementById('logPage');
        this.logOutForV = document.getElementById('logOutForV');
        this.tweetTemplate = document.getElementById('tweetTemplate');
        this.tweetContainer = document.getElementById('tweetContainer');
        this.filterForm = document.getElementById('filterForm');
        this.filterName = document.getElementById('fname');
        this.filterTag = document.getElementById('filterTag');
        this.filterDateFrom = document.getElementById('Data1');
        this.filterDateTo = document.getElementById('Data2');
        this.applyFilter = document.getElementById('app');
        this.addInW = document.getElementById('addInW');
        this.plusInW = document.getElementById('plusInW');
        this.plusInTweets = document.getElementById('plusInTweets');
        this.tweetPage = document.getElementById('tweet');
        this.tweetText = document.getElementById('text');
        this.tweetTags = document.getElementById('tagsInput');
        this.tweetTextStart = document.getElementById('tweetText');
        this.tweetTagsStart = document.getElementById('tags');
        this.withoutLog = document.getElementById('logOut');
        this.logForm = document.getElementById('logForm');
        this.logInB = document.getElementById('logIn');
        this.whatsInput = document.getElementById('whatsInput');
        this.whatsInputTags = document.getElementById('whatsInputTags');
        this.edit = document.querySelector('button.Edit');
        this.like = document.querySelector('button.like');
        this.ok = document.querySelectorAll('button.Ok');

    }

    setTweetView(tweetView = {}, tweet = {}) {

        tweetView.firstElementChild.id = tweet.id;
        if (this.currentUser === tweet.author) {
            tweetView.getElementById("edit").setAttribute('style', 'display: block');
            tweetView.getElementById("delete").setAttribute('style', 'display: block');
            tweetView.getElementById("like").setAttribute('style', 'display: none');
        }
        let index = tweet.likes.findIndex(like => like === this.currentUser);
        if (index !== -1) {
            tweetView.getElementById("like").setAttribute('style', 'background-color: #000000');
        }

        tweetView.querySelector('p.tweet-text').textContent = tweet.description;
        tweetView.querySelector('p.tags').textContent = '#' + tweet.hashTags.join(' #');
        tweetView.querySelector('h3.tweet-name').textContent = tweet.author + ' | ' + tweet.createdAt.toLocaleString();
    }

    showTweet(tweet = {}) {
        let tweetView = document.importNode(this.tweetTemplate.content, true);

        this.setTweetView(tweetView, tweet);

        this.tweetContainer.insertBefore(tweetView, this.tweetContainer.firstElementChild);
    }

    editTweet(id = '', tweet = {}) {
        let tweetView = document.importNode(this.tweetTemplate.content, true);

        this.setTweetView(tweetView, tweet);

        document.getElementById(id)?.replaceWith(tweetView);
    }

    removeTweet(id = '') {
        document.getElementById(id)?.remove();
    }

    likeTweet(id = '') {
        document.getElementById(id)?.querySelector('div.tweet-action').lastElementChild.setAttribute('style', 'background-color: #000000');
    }

    dislikeTweet(id = '') {
        document.getElementById(id)?.querySelector('div.tweet-action').lastElementChild.setAttribute('style', 'background-color: transparent');
    }

    clearView() {
        let first = this.tweetContainer.firstElementChild;

        while (first !== this.tweetContainer.lastElementChild) {
            first.remove();

            first = this.tweetContainer.firstElementChild;
        }
    }


}

let model;
let view;


function addTweet(tweet = {}) {
    if (model.add(tweet)) {
        view.showTweet(tweet);
    }
}

function editTweet(id = '', tweet = {}) {
    if (model.edit(id, tweet)) {
        view.editTweet(id, model.get(id));
    }
}

function removeTweet(id = '') {
    if (model.remove(id)) {
        view.removeTweet(id);
    }
}


function getPage(skip = 0, top = 10, filters = {}) {

    view.clearView();
    model.getPage(skip, top, filters).reverse().forEach(tweet => view.showTweet(tweet));
}

window.onload = () => {
    model = new Model(data);
    view = new View();

    getPage(0, 10)


};

function likeTweet(id = '', user = '') {
    if (model.like(id, user)) {
        view.likeTweet(id);
    } else {
        view.dislikeTweet(id);
    }
}

class Controller {
    static view;
    static model;
    static curUser;
    static curNumVisibleTweets;
    static curFilter;
    static curTweet;
    static users;


    constructor() {
        Controller.model = new Model();
        Controller.view = new View();

        Controller.view.withoutLog.addEventListener('click', Controller.logOut);
        Controller.view.logInB.addEventListener('click', Controller.logIn);
        Controller.view.applyFilter.addEventListener('click', Controller.filter);
        Controller.view.logForm.addEventListener('click', Controller.logBForm);
        Controller.view.plusInTweets.addEventListener('click', Controller.seeMore);
        Controller.view.addInW.addEventListener('click', Controller.doneTweet);
        Controller.view.logOutForV.addEventListener('click', Controller.logOutForV);
        Controller.view.tweetContainer.addEventListener('click', Controller.tweetAction);

        Controller.curUser = document.getElementById('userName').textContent;
        Controller.curNumVisibleTweets = 10;
        Controller.curFilter = {};
        Controller.curTweet = null;
        Controller.users = new Map();
        Controller.users.set('nikmalevich', '1111');
        Controller.users.set('anna', '2222');
        Controller.getPage(0, Controller.curNumVisibleTweets);
    }

    static getPage(skip = 0, top = 10, filters = {}) {
        Controller.view.clearView();

        Controller.model.getPage(skip, top, filters).reverse().forEach(tweet => Controller.view.showTweet(tweet));
        if (top <= Controller.model.number) {
            Controller.view.plusInTweets.setAttribute('style', 'display: block');
        } else {
            Controller.view.plusInTweets.setAttribute('style', 'display: none');
        }
    }

    static logBForm() {
        Controller.curUser = Controller.view.userInputName.value;
        Controller.view.currentUser = Controller.curUser;
        Controller.view.mainPage.getElementsByClassName('user')[0].innerHTML = Controller.curUser.toString();
        Controller.view.withoutLog.setAttribute('style', 'display: none');
        Controller.view.logOutForV.setAttribute('style', 'display: block');
        Controller.view.logPage.setAttribute('style', 'display: none');
        Controller.view.mainPage.setAttribute('style', 'display: block');
    }
    static logOutForV() {
        Controller.curUser = '';
        Controller.view.currentUser = '';

        Controller.view.mainPage.getElementsByClassName('user')[0].innerHTML = '';
        Controller.view.withoutLog.setAttribute('style', 'display: none');
        Controller.view.logInB.setAttribute('style', 'display: block');
        Controller.view.logOutForV.setAttribute('style', 'display: none');
        Controller.view.logPage.setAttribute('style', 'display: none');
        Controller.view.mainPage.setAttribute('style', 'display: block');
        Controller.getPage(0, 5, Controller.curFilter);
    }

    static logOut() {
        Controller.view.mainPage.getElementsByClassName('user')[0].innerHTML = '';
        Controller.view.withoutLog.setAttribute('style', 'display: none');
        Controller.view.logInB.setAttribute('style', 'display: block');
        Controller.view.logPage.setAttribute('style', 'display: none');
        Controller.view.mainPage.setAttribute('style', 'display: block');

    }

    static logIn() {
        Controller.view.withoutLog.setAttribute('style', 'display: block');
        Controller.view.logInB.setAttribute('style', 'display: none');
        Controller.view.logPage.setAttribute('style', 'display: block');
        Controller.view.mainPage.setAttribute('style', 'display: none');
    }



    static filter() {
        let Chek;
        let name = Controller.view.filterName.value;
        let hashTags = Controller.view.filterTag.value;
        let dateFrom = Controller.view.filterDateFrom.value;
        let dateTo = Controller.view.filterDateTo.value;

        Controller.curFilter = {};

        if (name !== '') {
            Controller.curFilter.author = name;
        }

        if (hashTags !== '') {
            Controller.curFilter.hashTags = hashTags.split(' ');
        }
        if (dateFrom !== '') {
            Controller.curFilter.dateFrom = new Date(dateFrom);
        }
        if (dateTo !== '') {
            Controller.curFilter.dateTo = new Date(dateTo);
        }

        Controller.getPage(0, 5, Controller.curFilter);
    }

    static tweetAction(event) {
        let chek;
        let id = event.target.parentElement.parentElement.id;
        let reez = event.target.className;
        switch (reez) {
            case 'like':
                let styl = event.target.style.backgroundColor;
                if (styl === "rgb(0, 0, 0)") {
                    Controller.view.dislikeTweet(id);
                    Controller.model.dislike(id, Controller.curUser);
                }
                else {
                    Controller.view.likeTweet(id);
                    Controller.model.like(id, Controller.curUser)
                }
                break;
            case 'Edit':
                event.target.parentElement.parentElement.getElementsByClassName('Edit')[0].setAttribute('style', 'display:none ');
                event.target.parentElement.parentElement.getElementsByClassName('Ok')[0].setAttribute('style', 'display:block ');
                let parentElement = event.target.parentElement.parentElement;
                let childElement = event.target.parentElement.parentElement.getElementsByClassName('tweet-text')[0];
                childElement.setAttribute('style', 'display: none');
                event.target.parentElement.parentElement.getElementsByClassName('tags')[0].setAttribute('style', 'display: none');
                event.target.parentElement.parentElement.getElementsByClassName('tweet-input-text')[0].setAttribute('style', 'display:inline ');
                event.target.parentElement.parentElement.getElementsByClassName('tweet-input-text')[0].value = event.target.parentElement.parentElement.getElementsByClassName('tweet-text')[0].innerHTML;
                event.target.parentElement.parentElement.getElementsByClassName('tags-input')[0].setAttribute('style', 'display: inline');
                event.target.parentElement.parentElement.getElementsByClassName('tags-input')[0].value = event.target.parentElement.parentElement.getElementsByClassName('tags')[0].innerHTML.replace('#', '');
                break;
            case 'Delete':
                if (Controller.model.remove(id)) {
                    Controller.view.removeTweet(id);
                }

                break;
            case 'Ok':
                Controller.curTweet = Controller.model.get(id);
                Controller.curTweet.hashTags = [];
                Controller.curTweet.description = event.target.parentElement.parentElement.getElementsByClassName('tweet-input-text')[0].value;
                Controller.curTweet.hashTags = event.target.parentElement.parentElement.getElementsByClassName('tags-input')[0].value.split(' ');
                let tweet = {
                    description: Controller.curTweet.description,
                    hashTags: Controller.curTweet.hashTags
                };

                if (Controller.curTweet === null) {
                    tweet.id = Controller.curNumVisibleTweets.toString();
                    tweet.createdAt = new Date(Date.now());
                    tweet.author = Controller.curUser;
                    tweet.likes = [];
                    if (Controller.curNumVisibleTweets < 10) {
                        this.curNumVisibleTweets++;
                    }


                }

                event.target.parentElement.parentElement.getElementsByClassName('tweet-input-text')[0].setAttribute('style', 'display: none');
                event.target.parentElement.parentElement.getElementsByClassName('tags-input')[0].setAttribute('style', 'display: none');
                Controller.curTweet.createdAt = new Date(Date.now());


                Controller.model.edit(id, Controller.curTweet);
                Controller.view.editTweet(id, Controller.curTweet);
                event.target.parentElement.parentElement.getElementsByClassName('tweet-text')[0].setAttribute('style', 'display: block');
                event.target.parentElement.parentElement.getElementsByClassName('tags')[0].setAttribute('style', 'display: block');
                Controller.getPage(0, 7, Controller.curFilter);

                break;
        }
    }

    static seeMore() {
        Controller.curNumVisibleTweets += 10;

        Controller.getPage(0, Controller.curNumVisibleTweets, Controller.curFilter);
    }

    static addTweet(event) {
        Controller.curTweet = null;

        event.preventDefault();
    }

    static doneTweet() {

        let description = Controller.view.whatsInput.value;
        let hashTags = [];
        hashTags = Controller.view.whatsInputTags.value.split(' ');

        if (description === '' || description.length > 200) {
            Controller.view.whatsInput.value = "";
            Controller.view.whatsInputTags.value = "";
            Controller.view.whatsInput.setAttribute('placeholder', 'Incorrect Try More');
            Controller.view.whatsInputTags.setAttribute('placeholder', 'Incorrect Try More');
            return;
        }


        let tweet = {
            description: description,
            hashTags: hashTags
        };

        Controller.curNumVisibleTweets++;
        tweet.id = Controller.curNumVisibleTweets.toString();
        tweet.createdAt = new Date(Date.now());
        tweet.author = Controller.curUser;
        tweet.likes = [];
        if (Controller.curNumVisibleTweets < 10) {
            this.curNumVisibleTweets++;
        }
        Controller.model.add(tweet);


        Controller.view.whatsInput.value = "";
        Controller.view.whatsInputTags.value = "";
        Controller.getPage(0, 6, Controller.curFilter);

    }
}

window.onload = () => {
    new Controller();
};

