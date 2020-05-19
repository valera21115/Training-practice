package servlets;

import com.google.gson.Gson;
import dao.PostDAO;
import dao.impl.PostDAOImpl;
import entity.Post;
import sun.security.pkcs11.wrapper.Constants;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;


//@WebServlet("/posts")
public class TweetsServlet extends HttpServlet {
    private PostDAO postDAO = new PostDAOImpl();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        long id = Long.parseLong(req.getParameter("id"));
        Post post = postDAO.getPost(id);
        resp.getWriter().print((new Gson()).toJson(post));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {


        if (req.getRequestURI().equals("/tweets/search")){
            int skip= Integer.parseInt(Optional.ofNullable((req.getParameter("skip"))).orElse("0"));
            int top= Integer.parseInt(Optional.ofNullable((req.getParameter("top"))).orElse("10"));
            resp.getWriter().write((new Gson()).toJson(postDAO.getPage(skip,top)));
        }
        long id = Long.parseLong(req.getParameter("id"));
        String description=req.getParameter("description");
        String author=req.getParameter("author");
        List<String> hashTags= Collections.singletonList(req.getParameter("hasTags"));
        String photoLink= req.getParameter("photoLink");
        List<String> likes=new ArrayList<>();

        Post post = new Post(id,description,new Date(),author,photoLink,hashTags,likes);

            resp.getWriter().write(Boolean.toString(postDAO.addPost(post)));

    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        long id = Long.parseLong(req.getParameter("id"));
        String description=req.getParameter("description");
        List<String> hashTags= Collections.singletonList(req.getParameter("hasTags"));
        String photoLink= req.getParameter("photoLink");


            Post post = new Post(description,photoLink,hashTags);
            resp.getWriter().write(Boolean.toString(postDAO.editPost(id,post)));

    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        long id = Long.parseLong(req.getParameter("id"));
            resp.getWriter().write(Boolean.toString(postDAO.removePost(id)));    }
}
