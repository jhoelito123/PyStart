import IconStar from '../icons/star';

type RatingProps = {
  rating: number;
  size?: number;
};

export function StarRating({ rating, size = 24 }: RatingProps) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <IconStar key={star} filled={rating >= star} size={size} />
      ))}
    </div>
  );
}
