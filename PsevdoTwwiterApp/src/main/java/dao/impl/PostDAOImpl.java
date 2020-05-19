package dao.impl;

import dao.PostDAO;
import entity.Post;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public class PostDAOImpl implements PostDAO {
    private List<Post> posts=new ArrayList<>();


    public PostDAOImpl(){
        List<String> hashTags=new ArrayList<>();
        List<String> likes=new ArrayList<>();

        hashTags.add("tag1");
        hashTags.add("tag2");
        hashTags.add("tag3");

        likes.add("user1");
        likes.add("user2");
        likes.add("user3");


        for(long i=1;i<=10;i++){
        posts.add(new Post(i
                ,"test"+i
                ,new Date()
                ,"testAuthor"+i
                ,"photoLink"+i
                ,hashTags
                ,likes));
        }

    }

    @Override
    public Post getPost(long id) {
        return posts.stream()
                .filter(post -> post.getId()==(id))
                .findAny()
                .orElse(null);
    }

    @Override
    public List<Post> getPage(int skip, int top) {
        List<Post> page = new ArrayList<>();
        int n;
        if(skip+top<posts.size())
        n= skip+top;
        else n=posts.size();


        for(int i=skip;i<n;i++){
            page.add(posts.get(i));
        }

        return page;
    }

    @Override
    public boolean addPost(Post post) {
        if (validate(post)){
            posts.add(post);
            return true;
        }
        return false;
    }

    @Override
    public boolean editPost(long id,Post post) {
        if (post!=null){
            Post changePost=this.getPost(id);
            changePost.setDescription(post.getDescription());
            changePost.setHashTags(post.getHashTags());
            changePost.setPhotoLink(post.getPhotoLink());

            return true;
        }
        return false;
    }

    @Override
    public boolean removePost(long id) {
        return posts.removeIf(post -> post.getId()==id);
    }

    public static boolean validate(Post post) {
        return String.valueOf(post.getId()) !=null && post.getId() >= 1 &&
                post.getDescription() != null && post.getDescription().length() < 250 &&
                post.getCreatedAt() != null &&
                post.getAuthor() != null && post.getAuthor().length() >= 1;
    }

}
