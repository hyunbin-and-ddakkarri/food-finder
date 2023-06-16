import { Restaurant, isOpenNow } from "@/app/restaurant";
import Image from 'next/image';


interface ListItemProps {
  restaurant: Restaurant;
  onClick: () => void;
}

export const ListItem: React.FC<ListItemProps> = ({ restaurant, onClick }) => {
  return (
    <div onClick={() => onClick()}>
      <div className="flex items-center space-x-4">
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-gray-900 truncate dark:text-white">
            {restaurant.name}
          </p>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            Rating: {restaurant.rating.toString()}
          </p>
        </div>
        <div className="text-xs inline-flex items-center text-base text-gray-900 dark:text-white">
          {
           isOpenNow(restaurant.businessHours, '일', 15) ? <p>Open</p> : <p>Closed</p>
          }
        </div>
      </div>
      <div className="flex">
        {
          restaurant.images.slice(0, 3).map((image, index) => {
            return (
              <div className="w-1/4" key={index}>
                <Image
                  alt="gallery"
                  width={100}
                  height={100}
                  className="rounded-md object-cover object-center"
                  src={image.toString()}
                />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
