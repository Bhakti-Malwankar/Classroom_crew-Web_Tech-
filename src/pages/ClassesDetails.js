// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { toast } from 'react-toastify';
// import './ClassesDetails.css';

// const ClassesDetails = () => {
//   const { classid } = useParams();
//   const [classroom, setClassroom] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [postTitle, setPostTitle] = useState('');
//   const [postDescription, setPostDescription] = useState('');

//   const [showJoinPopup, setShowJoinPopup] = useState(false);
//   const [otp, setOtp] = useState('');
//   const [showOtpPopup, setShowOtpPopup] = useState(false);
//   const [otpError, setOtpError] = useState('');

//   const navigate = useNavigate();


//   const fetchClassDetails = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/getclassbyid/${classid}`, {
//         method: 'GET',
//         credentials: 'include',
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setClassroom(data.data);
//       } else {
//         toast.error(data.message || 'Failed to fetch class details');
//       }
//     } catch (error) {
//       toast.error('Error fetching class details');
//     } finally {
//       setLoading(false);
//     }

//   }

//   useEffect(() => {
//     fetchClassDetails();
//   }, [classid]);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/getuser`, {
//           method: 'GET',
//           credentials: 'include',
//         });

//         const data = await response.json();

//         if (response.ok) {
//           setUser(data.data);
//         } else {
//           toast.error(data.message || 'Failed to fetch user data');
//         }
//       } catch (error) {
//         toast.error('An error occurred while fetching user data');
//       }
//     };

//     fetchUser();
//   }, []);


//   const handleAddPost = () => {
//     setShowPopup(true);  // Show the popup

//   }
//   const handleSubmitPost = async () => {
//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/addpost`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           title: postTitle,
//           description: postDescription,
//           classId: classid
//         }),
//         credentials: 'include',
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast.success('Post created successfully');
//         setPostTitle('');  // Clear the input fields
//         setPostDescription('');
//         setShowPopup(false);  // Close the popup
//         fetchClassDetails(); // Optionally refresh posts here
//       } else {
//         toast.error(data.message || 'Failed to create post');
//       }
//     }
//     catch (error) {
//       toast.error('An error occurred while creating the post');
//     }

//   }
//   const handleClosePopup = () => {
//     setShowPopup(false);  // Show the popup

//   }
//   const handleJoinRequest = async () => {
//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/request-to-join`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           classroomId: classid,
//           studentEmail: user?.email,
//         }),
//         credentials: 'include',
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setShowJoinPopup(false);
//         setShowOtpPopup(true);
//         toast.success('OTP sent to the class owner');
//       } else {
//         toast.error(data.message || 'Failed to send join request');
//       }

//     }
//     catch (error) {
//       toast.error('An error occurred while sending join request');
//     }
//   }

//   const handleSubmitOtp = async () => {

//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/verify-otp`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           classroomId: classid,
//           studentEmail: user?.email,
//           otp
//         }),
//         credentials: 'include',
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setOtp('');
//         setShowOtpPopup(false);
//         toast.success('Successfully joined the class');
//         fetchClassDetails(); // Refresh the classroom details
//       } else {
//         setOtpError(data.message || 'Failed to verify OTP');
//       }
//     } catch (error) {
//       console.log(error)
//       toast.error('An error occurred while verifying OTP');
//     }
//   }
//   const handleCloseOtpPopup = () => {
//     setShowOtpPopup(false);
//     setOtpError('');
//   }




//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   const isStudent = classroom?.students?.includes(user?.email);
//   const isOwner = classroom?.owner === user?._id


//   return (
//     <div className="class-details">
//       <div className="section1">
//         <img
//           src="https://via.placeholder.com/150"  // Dummy image
//           alt="Classroom"
//           className="class-image"
//         />
//         <h1 className="class-name">{classroom?.name}</h1>
//         <p className="class-description">{classroom?.description}</p>

//         {isOwner && (
//           <button className="add-post-btn" onClick={handleAddPost}>
//             Add Post
//           </button>
//         )}

//         {!isStudent && !isOwner && (
//           <button className="add-post-btn" onClick={() => setShowJoinPopup(true)}>
//             Join Class
//           </button>
//         )}
//       </div>

//       <div className='post-grid'>
//         {
//           (isStudent || isOwner) && classroom?.posts?.length > 0 ? (
//             classroom.posts.map((post, index) => (
//               <div key={index} className="post-card">
//                 <h3>{post.title}</h3>
//                 <p>{post.description}</p>
//                 <small>{new Date(post.createdAt).toLocaleDateString()}</small>
//               </div>

//             ))
//           ) : (
//             <p>No posts available</p>
//           )

//         }
//       </div>

//       {showPopup && (
//         <div className="popup-overlay">
//           <div className="popup-content">
//             <h3>Add Post</h3>
//             <input
//               type="text"
//               placeholder="Title"
//               value={postTitle}
//               onChange={(e) => setPostTitle(e.target.value)}
//             />
//             <textarea
//               placeholder="Description"
//               value={postDescription}
//               onChange={(e) => setPostDescription(e.target.value)}
//             />
//             <div className="popup-buttons">
//               <button onClick={handleSubmitPost}>Submit</button>
//               <button onClick={handleClosePopup}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}


//       {showJoinPopup && (
//         <div className="popup-overlay">
//           <div className="popup-content">
//             <h3>Join Request</h3>
//             <p>Do you want to join this class? An OTP will be sent to the class owner for approval.</p>

//             <div className="popup-buttons">

//               <button onClick={handleJoinRequest}>Send Join Request</button>
//               <button onClick={() => setShowJoinPopup(false)}>Close</button>
//             </div>
//           </div>

//         </div>

//       )}


//       {showOtpPopup && (
//         <div className="popup-overlay">
//           <div className="popup-content">
//             <h3>Enter OTP</h3>
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//             />
//             {otpError && <p className="otp-error">{otpError}</p>}

//             <div className="popup-buttons">
//               <button onClick={handleSubmitOtp}>Submit</button>
//               <button onClick={handleCloseOtpPopup}>Close</button>
//             </div>
//           </div></div>
//       )}


//     </div>
//   )
// }

// export default ClassesDetails

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ClassesDetails.css';

const ClassesDetails = () => {
  const { classid } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizResults, setQuizResults] = useState();
  const [quizResultsdisplay, setQuizResultsdisplay] = useState(false);

  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpError, setOtpError] = useState('');


  const isStudent = classroom?.students?.includes(user?._id);
  const isOwner = classroom?.owner === user?._id;

  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/class/getclassbyid/${classid}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      const data = await response.json();
      if (response.ok) {
        setClassroom(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch class details');
      }
    } catch (error) {
      toast.error('Error fetching class details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/getuser`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUser(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch user data');
      }
    } catch (error) {
      toast.error('An error occurred while fetching user data');
    }
  };

  useEffect(() => {
    fetchClassDetails();
    fetchUser();
  }, [classid]);

  const handleAddPost = async () => {
    const formData = new FormData();
    formData.append('title', postTitle);
    formData.append('description', postDescription);
    formData.append('classId', classid);
    if (pdfFile) formData.append('pdf', pdfFile);
    formData.append('quiz', JSON.stringify(quiz));

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/class/addpost`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success('Post created successfully');
        setShowPopup(false);
        fetchClassDetails();
      } else {
        toast.error(data.message || 'Failed to create post');
      }
    } catch (error) {
      toast.error('An error occurred while creating the post');
    }
  };

  const addQuestion = () => {
    setQuiz([...quiz, { question: '', options: [{ option: '', isCorrect: false }] }]);
  };

  const updateQuestion = (index, value) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[index].question = value;
    setQuiz(updatedQuiz);
  };

  const addOption = (index) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[index].options.push({ option: '', isCorrect: false });
    setQuiz(updatedQuiz);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[questionIndex].options[optionIndex].option = value;
    setQuiz(updatedQuiz);
  };

  const toggleCorrectOption = (questionIndex, optionIndex) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[questionIndex].options[optionIndex].isCorrect =
      !updatedQuiz[questionIndex].options[optionIndex].isCorrect;
    setQuiz(updatedQuiz);
  };

  const handleTakeQuiz = (questions) => {
    setCurrentQuiz(questions);
    setUserAnswers(Array(questions.length).fill(null));
    setIsTakingQuiz(true);
  };

  const handleSubmitQuiz = async () => {
    const correctAnswers = currentQuiz.filter((question, index) =>
      question.options.some(
        (option) => option.isCorrect && option.option === userAnswers[index]
      )
    ).length;
  
    const score = correctAnswers; // Customize scoring logic if needed
    const resultsPayload = {
      classId: classid,
      userId: user?._id,
      score,
    };

    console.log(resultsPayload);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/submit-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(resultsPayload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success('Quiz results submitted successfully');
        setQuizResultsdisplay({ total: currentQuiz.length, correct: correctAnswers });
      } else {
        toast.error(data.message || 'Failed to submit quiz results');
      }
    } catch (error) {
      console.error('Error submitting quiz results:', error);
      toast.error('An error occurred while submitting quiz results');
    }
  
    setIsTakingQuiz(false);
  };
  

  


  const handleClosePopup = () => {
    setShowPopup(false);  // Show the popup
  }

  const handleJoinRequest = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/request-to-join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classroomId: classid,
          studentEmail: user?.email,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setShowJoinPopup(false);
        setShowOtpPopup(true);
        toast.success('OTP sent to the class owner');
      } else {
        toast.error(data.message || 'Failed to send join request');
      }

    }
    catch (error) {
      toast.error('An error occurred while sending join request');
    }
  }

  const handleSubmitOtp = async () => {

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classroomId: classid,
          studentEmail: user?.email,
          otp
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setOtp('');
        setShowOtpPopup(false);
        toast.success('Successfully joined the class');
        fetchClassDetails(); // Refresh the classroom details
      } else {
        setOtpError(data.message || 'Failed to verify OTP');
      }
    } catch (error) {
      console.log(error)
      toast.error('An error occurred while verifying OTP');
    }
  }
  const handleCloseOtpPopup = () => {
    setShowOtpPopup(false);
    setOtpError('');
  }

  const fetchQuizResults = async () => {
    if (!isOwner) return;
  
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/class/quiz-results/${classid}`,
        { method: 'GET', credentials: 'include' }
      );
  
      const data = await response.json();
      if (response.ok) {
        setQuizResults(data.data || []); // Ensure default to empty array
      } else {
        toast.error(data.message || 'Failed to fetch quiz results');
        setQuizResults([]); // Prevent null or undefined
      }
    } catch (error) {
      toast.error('An error occurred while fetching quiz results');
      setQuizResults([]); // Prevent null or undefined
    }
  };
  
  
  useEffect(() => {
    fetchQuizResults();
  }, [classid, isOwner]);
  


  if (loading) {
    return <div className="loading">Loading...</div>;
  }


  return (
    <div className="class-details">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="section1">
            <img
              src={classroom?.image || 'https://via.placeholder.com/150'}
              alt="Classroom"
              className="class-image"
            />
            <h1 className="class-name">{classroom?.name}</h1>
            <p className="class-description">{classroom?.description}</p>

            {isOwner && (
              <button className="add-post-btn" onClick={() => setShowPopup(true)}>
                Add Post
              </button>
            )}

            {(!isStudent || isOwner) && !isOwner && (
              <button className="add-post-btn" onClick={() => setShowJoinPopup(true)}>
              Join Class
              </button>
            )}
          </div>

          <div className="post-grid">
            {
            (isStudent || isOwner) && classroom?.posts?.length > 0 ? (
              classroom.posts.map((post, index) => (
                <div key={index} className="post-card">
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  {post.file && (
                    <a
                      href={`${process.env.REACT_APP_API_BASE_URL}/class/download/${post._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      Download PDF
                    </a>
                  )}
                  <br />
                  {post.quizId && post.quizId.questions && post.quizId.questions.length > 0 ? (
                    <div>
                      <h4>Quiz</h4>
                      {!isOwner && (
                        <button onClick={() => handleTakeQuiz(post.quizId.questions)}>
                          Take Quiz
                        </button>
                      )}
                    </div>
                  ) : (
                    <p>No quiz available</p>
                  )}
                  <small>{new Date(post.createdAt).toLocaleDateString()}</small>
                </div>
              ))
            ) : (
              <p>No posts available</p>
            )}
          </div>

          {showPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <h3>Add Post</h3>
                <input
                  type="text"
                  placeholder="Title"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                />
                <textarea
                  placeholder="Description"
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                />

                <h4>Create Quiz</h4>
                {quiz.map((q, qIndex) => (
                  <div key={qIndex} className="quiz-question">
                    <input
                      type="text"
                      placeholder={`Question ${qIndex + 1}`}
                      value={q.question}
                      onChange={(e) => updateQuestion(qIndex, e.target.value)}
                    />
                    {q.options.map((o, oIndex) => (
                      <div key={oIndex}>
                        <input
                          type="text"
                          placeholder={`Option ${oIndex + 1}`}
                          value={o.option}
                          onChange={(e) =>
                            updateOption(qIndex, oIndex, e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => toggleCorrectOption(qIndex, oIndex)}
                        >
                          {o.isCorrect ? 'Correct' : 'Mark as Correct'}
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addOption(qIndex)}>
                      Add Option
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addQuestion}>
                  Add Question
                </button>

                <div className="popup-buttons">
                  <button onClick={handleAddPost}>Submit</button>
                  <button onClick={() => setShowPopup(false)}>Close</button>
                </div>
              </div>
            </div>
          )}

          {showJoinPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <h3>Join Request</h3>
                <p>Do you want to join this class? An OTP will be sent to the class owner for approval.</p>

                <div className="popup-buttons">

                  <button onClick={handleJoinRequest}>Send Join Request</button>
                  <button onClick={() => setShowJoinPopup(false)}>Close</button>
                </div>
              </div>

            </div>

          )} 

          {showOtpPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <h3>Enter OTP</h3>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                {otpError && <p className="otp-error">{otpError}</p>}

                  <div className="popup-buttons">
                    <button onClick={handleSubmitOtp}>Submit</button>
                    <button onClick={handleCloseOtpPopup}>Close</button>
                  </div>
              </div> 
            </div>
          )}

          {isTakingQuiz && (
            <div className="quiz-modal">
              <div className="quiz-content">
                <h3>Quiz</h3>
                {currentQuiz.map((question, qIndex) => (
                  <div key={qIndex}>
                    <p>{question.question}</p>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex}>
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          value={option.option}
                          onChange={() => {
                            const updatedAnswers = [...userAnswers];
                            updatedAnswers[qIndex] = option.option;
                            setUserAnswers(updatedAnswers);
                          }}
                        />
                        <label>{option.option}</label>
                      </div>
                    ))}
                  </div>
                ))}
                <button onClick={handleSubmitQuiz}>Submit Quiz</button>
              </div>
            </div>
          )}

{isOwner && quizResults  && quizResults.length > 0 && (
  <div className="quiz-results-section">
    <h3>Quiz Results</h3>
    <table>
      <thead>
        <tr>
          <th>Student Name</th>
          <th>Email</th>
          <th>Score</th>
          <th>Submitted At</th>
        </tr>
      </thead>
      <tbody>
        {quizResults.map((result) => (
          <tr key={result._id}>
            <td>{result.userId.name}</td>
            <td>{result.userId.email}</td>
            <td>{result.score}</td>
            <td>{new Date(result.submittedAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

          {quizResultsdisplay && (
            <div className="quiz-results">
              <h3>Quiz Results</h3>
              <p>Total Questions: {quizResultsdisplay.total}</p>
              <p>Correct Answers: {quizResultsdisplay.correct}</p>
              <button onClick={() => setQuizResultsdisplay(null)}>Close</button>
            </div>
          )}
        </>
      )}
    </div>
    
    

    
  );
};

export default ClassesDetails;