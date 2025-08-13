import React, { useEffect, useState } from "react";
import "./Review.css"

const Review = ({ course_id, user_id, URL }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Thông tin review gửi lên server
  const ifReview = {
    user_id,
    khoaHoc_id: course_id,
    content,
    rating,
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `${URL}/api/review/getReview?khoaHoc_id=${course_id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json(); // nhớ gọi hàm json()
        setReviews(data?.result || []); // phòng trường hợp result không có
      } catch (error) {
        console.error("Lỗi khi load review:", error);
      }
    };

    if (course_id) {
      fetchReviews();
    }
  }, [course_id, URL]);

  // Gửi review mới
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user_id) {
      alert("Bạn cần đăng nhập để đánh giá");
      return;
    }
    if (!content.trim()) {
      alert("Vui lòng nhập bình luận");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${URL}/api/review/addReview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ifReview}), // gửi trực tiếp đối tượng ifReview, không phải { ifReview }
      });

      if (!res.ok) throw new Error("Lỗi khi gửi đánh giá");

      setRating(5);
      setContent("");

      // Reload lại danh sách review
      const updatedRes = await fetch(
        `${URL}/api/review/getReview?khoaHoc_id=${course_id}`
      );
      const updatedData = await updatedRes.json();
      setReviews(updatedData?.result || []);
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="review-container">
      <h3>Đánh giá khóa học</h3>

      <form onSubmit={handleSubmit}>
        <label>
          Đánh giá:
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((star) => (
              <option key={star} value={star}>
                {star} sao
              </option>
            ))}
          </select>
        </label>

        <label>
          Bình luận:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết bình luận..."
            rows={3}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </form>

      <hr />

      {reviews.length === 0 ? (
        <p>Chưa có đánh giá nào.</p>
      ) : (
        <ul className="review-list">
          {reviews.map((rev) => (
            <li key={rev.review_id}>
              <strong>{rev?.tenDangNhap}</strong> - {rev.rating} sao
              <p>{rev.content}</p>
              <small>{new Date(rev.create_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Review;
