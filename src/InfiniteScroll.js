import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function InfiniteScroll() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false); // use this if you want the box to say "loading...". Forgot this lol.
  const [prevY, setPrevY] = useState(0);
  let photosRef = useRef({});

  let loadingRef = useRef(null);
  let prevYRef = useRef({});
  let pageRef = useRef({});
  photosRef.current = photos;
  pageRef.current = page;

  prevYRef.current = prevY;

  console.log("laodingRef: ", loadingRef);

  useEffect(() => {
    getPhotos();
    setPage(pageRef.current + 1);

    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    observer.observe(loadingRef.current);
  }, []);

  const handleObserver = (entities, observer) => {
    console.log("time to get more photos");

    const y = entities[0].boundingClientRect.y;

    if (prevYRef.current > y) {
      console.log("actually getting photos.");
      getPhotos();
      setPage(pageRef.current + 1);
    } else {
      console.log("conditional is false");
    }
    console.log("currenty: ", y, "prevY: ", prevY);
    setPrevY(y);
  };

  const getPhotos = async () => {
    try {
      let photosRetrieved = await axios.get(
        `https://jsonplaceholder.typicode.com/photos?_page=${pageRef.current}&_limit=10`
      );
      if (photosRetrieved) {
        setPhotos([...photosRef.current, ...photosRetrieved.data]);
      }
    } catch (error) {
      console.log("ERROR GETTING PHOTOS");
    }
  };

  return (
    <div>
      <div>
        {photos.map((photo) => (
          <div key={uuidv4()}>
            <h4>id: {photo.id}</h4>
            <img src={photo.url} height="150px" width="200px" />
          </div>
        ))}
      </div>
      <div
        className="yoHello"
        ref={loadingRef}
        style={{ height: "100px", margin: "25px", background: "violet" }}
      >
        <span style={{ display: loading ? "block" : "none" }}>Loading...</span>
      </div>
    </div>
  );
}

export default InfiniteScroll;
