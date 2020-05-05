let tweets =([
    {
        id: '1',
        description: 'Более 76 тыс. человек во всем мире уже излечились от заболевания, спровоцированного новым коронавирусом, тогда как количество смертей превысило 6,4 тыс.',
        createdAt: new Date(),
        author: 'Иванов Иван',
        photoLink: 'https://www.pressball.by/images/stories/2020/03/20200310231542.jpg',
        hashTags: [
                'tag1','tag2','tag3'
            ],
        likes: [
                'user1','user2','user3'
            ]
    },
    {
        id: '2',
        description: 'test2',
        createdAt: new Date(),
        author: 'test2',
        photoLink: 'https://www.pressball.by/images/stories/2020/03/20200310231542.jpg',
         hashTags: [
                'tag1','tag2','tag3'
            ],
        likes: [
                'user1','user2','user3'
            ]
    },
    {
        id: '3',
        description: 'test3',
        createdAt: new Date(),
        author: 'test3',
        photoLink: 'https://www.pressball.by/images/stories/2020/03/20200310231542.jpg',
         hashTags: [
                'tag1','tag2','tag3'
            ],
        likes: [
                'user1','user2','user3'
            ]
    },
    {
        id: '4',
        description: 'test4',
        createdAt: new Date(),
        author: 'test4',
        photoLink: 'https://www.pressball.by/images/stories/2020/03/20200310231542.jpg',
         hashTags: [
                'tag1','tag2','tag3'
            ],
        likes: [
                'user1','user2','user3'
            ]
    },
    {
        id: '5',
        description: 'test5',
        createdAt: new Date(),
        author: 'test5',
        photoLink: 'https://www.pressball.by/images/stories/2020/03/20200310231542.jpg',
         hashTags: [
                'tag1','tag2','tag3'
            ],
            likes: [
                'user1','user2','user3'
            ]
    },
    {
        id: '6',
        description: 'test6',
        createdAt: new Date(),
        author: 'test6',
        photoLink: 'https://www.pressball.by/images/stories/2020/03/20200310231542.jpg',
         hashTags: [
                'tag1','tag2','tag3'
            ],
        likes: [
                'user1','user2','user3'
            ]
    },
    {
        id: '7',
        description: 'test7',
        createdAt: new Date(),
        author: 'test7',
        photoLink: 'https://www.pressball.by/images/stories/2020/03/20200310231542.jpg',
         hashTags: [
                'tag1','tag2','tag3'
            ],
        likes: [
                'user1','user2','user3'
            ]
    },

]);

class Model {
    tweets = [];

    constructor(tweets) {
        this.tweets = tweets;
    }

    getPage(skip , top , filterConfig) {
        if (typeof skip !== 'number' || typeof top !== 'number') {
            console.log('Incorrect input!');
            return;
        }
        
        skip = skip || 0;
        top = top || 10;
        this.filterConfig = filterConfig;


        if (filterConfig){
            let returningTweets = this.tweets;

            for (let param in filterConfig){
                 if (param === 'hashTags'){
                    for (let i = 0; i < filterConfig.hashTags.length; i++){
                        returningTweets = returningTweets.filter(tweet => tweet.hashTags.includes(filterConfig.hashTags[i]));
                    }
                }
                else if (param === 'dateFrom'){
                    returningTweets = returningTweets.filter(tweet => tweet.createdAt >= filterConfig.dateFrom);
                }
                else if (param === 'dateTo'){
                    returningTweets = returningTweets.filter(tweet => tweet.createdAt < filterConfig.dateTo);
                }
                else if (param === 'author'){
                    returningTweets = returningTweets.filter(tweet => tweet.author === filterConfig.author);
                }
            }

            returningTweets.sort(Model.comparator_BY_DATE);

            return returningTweets.slice(skip, skip + top);
        }
        else {
            let returningTweets = this.tweets.slice(skip, skip + top);

            returningTweets.sort(Model.comparator_BY_DATE);

            return returningTweets;
        }
    }

    static comparator_BY_DATE(a, b) {
       return b.createdAt - a.createdAt;
    }

     get(id) {
        if (typeof id === 'string'){
            return this.tweets.find(tweet => tweet.id === id);
        }
        else {
            console.log('Incorrect type of id.');
        }
    }

        static validate(tweet, params = ['id', 'description', 'author', 'createdAt', 'photoLink','hashTags','likes']) {
        return params.every(function (param) {
            switch (param) {
                case 'id':
                    if (!tweet.id || typeof tweet.id !== 'string'){
                        return false;
                    }
                    break;
                case 'description':
                    if (!tweet.description || typeof tweet.description !== 'string' || tweet.description.length > 250){
                        return false;
                    }
                    break;
                case 'author':
                    if (!tweet.author || typeof tweet.author !== 'string'){
                        return false;
                    }
                    break;
                case 'createdAt':
                    if (!tweet.createdAt || Object.prototype.toString.call(tweet.createdAt) !== '[object Date]'){
                        return false;
                    }
                    break;
                case 'photoLink':
                    if (tweet.photoLink && typeof tweet.photoLink !== 'string'){
                        return false;
                    }
                    break;
                case 'hashTags':
                    if (tweet.hashTags){
                        if (!tweet.hashTags.every(tag => typeof tag === 'string')){
                            return false;
                        }
                    }
                    break;
                case 'likes':
                    if (tweet.likes.length !==0){
                        if (!tweet.likes.every(like => typeof like === 'string')){
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

     add(tweet){
         tweet.createdAt=new Date();
         tweet.likes=[];
        if (Model.validate(tweet)){
           
            this.tweets.push(tweet);
            this.tweets.sort(Model.comparator_BY_DATE);
            return true;
        }
        return false;
    }

     edit(id, tweet){
        for (let param in tweet){
            if (param === 'id' || param === 'author' || param === 'createdAt'|| param === 'likes'){
                console.log("You can't change id, author, createdAt, likes");
                return false;
            }
        }

        if(!Model.validate(tweet, Object.keys(tweet))){
            return false;
        }

        let editingTweet = this.get(id);

        for (let param in tweet){
            editingTweet[param] = tweet[param];
        }

        return true;
    }

    remove(id){
        if (typeof id === 'string'){
            let index = this.tweets.findIndex(tweet => tweet.id === id);

            if (index !== -1){
                this.tweets.splice(index, 1);

                return true;
            }
        }
        return false;
    }

        addAll(tweets) {
        let invalidtweets = [];

        tweets.forEach(tweet => {
            if (Model.validate(tweet)){
                this.add(tweet);
            }else{
             invalidtweets.push(tweet)
         }
        });

        return invalidtweets;
    }

     clear() {
        this.tweets = [];
    }

   like(id = '', user = '') {
    let tweet = this.get(id);
        for (let like in tweet.likes){
            if(tweet.likes[like]===user){
                return false;
            }
        }
    if(tweet.likes)
        tweet.likes.push(user);

        return true;
    }
}


class View {
    tweetTemplate;
    tweetContainer;
    currentUser;

    constructor() {
        this.tweetTemplate = document.getElementById('tweetTemplate');
        this.tweetContainer = document.getElementById('tweetContainer');
        this.currentUser = 'Valery';
    }

    setTweetView(tweetView = {}, tweet = {}) {

    tweetView.firstElementChild.id = tweet.id;
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

        this.settweetView(tweetView, tweet);

        document.getElementById(id)?.replaceWith(tweetView);
    }

    removeTweet(id = '') {
        document.getElementById(id)?.remove();
    }

    likeTweet(id = '') {
        document.getElementById(id)?.querySelector('div.tweet-action').lastElementChild.setAttribute('style', 'background-color: #000000');
    }

    dislikeTweet(id = '') {
        document.getElementById(id)?.querySelector('div.tweet-action').firstElementChild.setAttribute('style', 'background-color: transparent');
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

function editTtweet(id = '', tweet = {}) {
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
    model = new Model(tweets);
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
