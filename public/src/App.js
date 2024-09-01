import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fee, setFee] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(
    localStorage.getItem('coursePerPage') || 5
  );
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    getCourses(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const getCourses = async (page, limit) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `http://localhost:3000/course/get-courses?page=${page}&coursePerPage=${limit}`,
        { headers: { Authorization: token } }
      );
      setCourses(response.data.courses);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const addCourse = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const courseData = { name, description, fee };

    try {
      const response = await axios.post(
        'http://localhost:3000/course/add-courses',
        courseData,
        { headers: { Authorization: token } }
      );
      setCourses([...courses, response.data]);
      setName('');
      setDescription('');
      setFee('');
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const deleteCourse = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `http://localhost:3000/course/delete-course/${id}`,
        { headers: { Authorization: token } }
      );
      setCourses(courses.filter((course) => course._id !== id));
      getCourses(currentPage, itemsPerPage); // Refresh course list after deletion
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handlePaginationClick = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    const limit = e.target.value;
    setItemsPerPage(limit);
    localStorage.setItem('coursePerPage', limit);
  };

  return (
    <div className="App">
      <h1>Course Management</h1>
      <form onSubmit={addCourse}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Course Name"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="number"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          placeholder="Fee"
          required
        />
        <button type="submit">Add Course</button>
      </form>

      <div>
        <label>Courses Per Page: </label>
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Description</th>
            <th>Fee</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>
                {course.day}-{course.month}-{course.year}
              </td>
              <td>{course.name}</td>
              <td>{course.description}</td>
              <td>{course.fee}</td>
              <td>
                <button onClick={() => deleteCourse(course._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div id="pagination-button">
        {pagination.hasPreviousPage && (
          <button onClick={() => handlePaginationClick(pagination.previousPage)}>
            {pagination.previousPage}
          </button>
        )}
        <button>{pagination.currentPage}</button>
        {pagination.hasNextPage && (
          <button onClick={() => handlePaginationClick(pagination.nextPage)}>
            {pagination.nextPage}
          </button>
        )}
        {pagination.currentPage !== pagination.lastPage && (
          <button onClick={() => handlePaginationClick(pagination.lastPage)}>
            {pagination.lastPage}
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
