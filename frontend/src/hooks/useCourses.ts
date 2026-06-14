import { useState, useEffect } from 'react';

export const useCourses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder API call
    setTimeout(() => {
      setCourses([{ id: 1, title: 'Introduction to AI' }, { id: 2, title: 'Advanced Machine Learning' }]);
      setLoading(false);
    }, 1000);
  }, []);

  return { courses, loading };
};
