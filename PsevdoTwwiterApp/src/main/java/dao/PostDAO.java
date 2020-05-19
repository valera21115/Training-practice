package dao;

import entity.Post;

import java.util.List;

public interface PostDAO {
    Post getPost(long id);
    List<Post> getPage(int skip,int top);
    boolean addPost(Post post);
    boolean editPost(long id,Post post);
    boolean removePost(long id);
}
