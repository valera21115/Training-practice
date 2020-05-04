package entity;

import javafx.geometry.Pos;

import java.util.Date;
import java.util.List;
import java.util.Objects;

public class Post {
    private long id;
    private String description;
    private Date createdAt;
    private String author;
    private String photoLink;
    private List<String> hashTags;
    private List<String> likes;

    public Post(long id
            , String description
            , Date date
            , String author
            , String photoLink
            , List<String> hashTags
            , List<String> likes) {

        this.id = id;
        this.description = description;
        this.createdAt = (Date)date.clone();
        this.author = author;
        this.photoLink = photoLink;
        this.hashTags = hashTags;
        this.likes = likes;
    }

    public Post(String description,String photoLink, List<String> hashTags){
        this.description = description;
        this.createdAt = new Date();
        this.photoLink = photoLink;
        this.hashTags = hashTags;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getPhotoLink() {
        return photoLink;
    }

    public void setPhotoLink(String photoLink) {
        this.photoLink = photoLink;
    }

    public List<String> getHashTags() {
        return hashTags;
    }

    public void setHashTags(List<String> hashTags) {
        this.hashTags = hashTags;
    }

    public List<String> getLikes() {
        return likes;
    }

    public void setLikes(List<String> likes) {
        this.likes = likes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Post)) return false;
        Post post = (Post) o;
        return id == post.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}
