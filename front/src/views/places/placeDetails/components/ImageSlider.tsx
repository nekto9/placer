import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './style.styl';
import { ChevronLeft, ChevronRight } from '@gravity-ui/icons';
import { Button, Card, Icon } from '@gravity-ui/uikit';

interface ImageSliderProps {
  images: string[];
}

export const ImageSlider = (props: ImageSliderProps) => (
  <Card type="container" view="outlined" style={{ overflow: 'hidden' }}>
    <Swiper
      effect={'slide'}
      navigation={{
        nextEl: '.swiper-custom__next',
        prevEl: '.swiper-custom__prev',
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Navigation, Pagination]}
      className="mySwiper"
      loop={props.images.length > 1}
    >
      {props.images.map((image, index) => (
        <SwiperSlide key={index}>
          <img src={image} />
        </SwiperSlide>
      ))}
      <div className="swiper-custom">
        <Button
          className=" swiper-custom__prev"
          view="flat"
          pin="circle-circle"
          size="xl"
        >
          <Icon data={ChevronLeft} size={32} />
        </Button>
        <Button
          className="swiper-custom__next"
          view="flat"
          pin="circle-circle"
          size="xl"
        >
          <Icon data={ChevronRight} size={32} />
        </Button>
      </div>
    </Swiper>
  </Card>
);
