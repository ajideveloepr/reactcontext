import { createContext, useState, useEffect, Children } from "react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import api from '../api/post'
import { useWindowSize } from '../hooks/useWindowSize';
import useAxiosFetch from '../hooks/useAxiosFetch';

const DataContext = createContext({})

export const DataProvider = () => {


    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [postTitle, setPostTitle] = useState('')
    const [postBody, setPostBody] = useState('')
    const [editTitle, setEditTitle] = useState('')
    const [editBody, setEditBody] = useState('')
    const navigate = useNavigate()
    const { width } = useWindowSize()
    const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/posts');
    useEffect(() => {
        setPosts(data);
    }, [data])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const id = posts.length ? posts[posts.length - 1].id + 1 : 1
        const datetime = format(new Date(), 'MMMM dd, yyyy pp')
        const newPost = {
            id, title: postTitle, datetime, body
                : postBody
        }
        try {
            const response = await api.post('/posts', newPost)
            const allpost = [...posts, response.data]
            setPosts(allpost)
            setPostTitle('')
            setPostBody('')
            navigate('/')
        } catch (err) {
            if (err.response) {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else {
                console.log(`Error: ${err.message}`);
            }
        }
    }

    useEffect(() => {
        const filteredResult = posts.filter((post) =>
            ((post.body).toLowerCase()).includes(search.toLowerCase())
            || ((post.title).toLowerCase()).includes(search.toLowerCase()))
        setSearchResult(filteredResult.reverse())
    }, [posts, search])

    const handeleDelete = async (id) => {
        try {
            await api.delete(`posts/${id}`)
            const postList = posts.filter(post => post.id !== id)
            setPosts(postList)
            navigate('/')
        } catch (err) {
            if (err.response) {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else {
                console.log(`Error: ${err.message}`);
            }
        }


    }



    const handleUpdate = async (id) => {
        const datetime = format(new Date(), 'MMMM dd, yyyy pp')
        const updatedPost = {
            id, title: editTitle, datetime, body
                : editBody
        }
        try {
            const response = await api.put(`posts/${id}`, updatedPost)
            setPosts(posts.map(post => post.id === id ? { ...response.data } : post))
            setEditTitle('')
            setEditBody('')
            navigate('/')
        } catch (err) {
            if (err.response) {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else {
                console.log(`Error: ${err.message}`);
            }
        }
    }



    return (
        <DataContext.Provider value={{
            width, search, setSearch, searchResult, isLoading, fetchError,
            handleSubmit, postTitle, setPostTitle, postBody, setPostBody,
            posts, handeleDelete, editBody, setEditBody, editTitle, setEditTitle, handleUpdate

        }}>
            {Children}
        </DataContext.Provider>
    )
}
export default DataContext