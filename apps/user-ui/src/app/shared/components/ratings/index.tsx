import React, { FC } from 'react';
import StarEmpty from '../../../assets/svgs/star-empty';
import StarFilled from '../../../assets/svgs/star-filled';
import StarHalf from '../../../assets/svgs/star-half';

type Props = {
  rating: number;
};

const Ratings: FC<Props> = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<StarFilled key={`star-${i}`} />);
    } else if (i === Math.ceil(rating) && !Number) {
      stars.push(<StarHalf key={`half-${i}`} />);
    } else {
      stars.push(<StarEmpty key={`empty-${i}`} />);
    }
  }
    return <div className='flex gap-1'>{stars}</div>;
};

export default Ratings;
