import { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  FaArrowsAlt, FaImage, FaTrash, FaCheck, FaTimes
} from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import TextField from '../../../../components/Basic/TextField';
import CKEditor from '../../../../components/CkEditor';
import PageContent from '../../../../components/PageContent/PageContent';
import PageHeader from '../../../../components/PageHeader/PageHeader';
import Button from '../../../../components/Basic/Button';
import { IMAGE_BASE } from '../../../App/constants';

// Sortable item component
const SortableImageItem = ({ item, index, handleSetImage, handleImageLinkChange, handleRemoveSlide, handleImageEditorChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-gray-200 rounded mt-2 p-4 border">
      <div className="flex">
        <div className="w-1/4">
          <label>Image</label>
          {item.image ? (
            <div className="h-32 overflow-hidden" onClick={() => handleSetImage(index)}>
              <img
                src={typeof item.image === 'string' ? `${IMAGE_BASE}${item.image}` : `${IMAGE_BASE}${item.image.path}`}
                className="object-fit"
              />
            </div>
          ) : (
            <div className="bg-white border h-32 flex items-center justify-center cursor-pointer" onClick={() => handleSetImage(index)}>
              <FaImage className="text-4xl text-gray-300" />
            </div>
          )}
          <TextField
            label={'Link'}
            className={'mt-4'}
            id={`slider-link-${index}`}
            type="text"
            value={item.link || ''}
            onChange={handleImageLinkChange(index)}
          />
        </div>
        <div className="flex-1 px-2">
          <CKEditor description={item.description} label={'Description'} getValue={handleImageEditorChange} forArray={index} />
        </div>
        <div className="w-10 flex flex-col justify-center items-center">
          <span {...attributes} {...listeners} className="hover:bg-blue-100 cursor-move w-8 h-8 flex justify-center items-center rounded-full">
            <FaArrowsAlt className="text-base transform scale-110 text-blue-500" />
          </span>
          <span className="icon-trash mt-2" onClick={() => handleRemoveSlide(index)}>
            <FaTrash />
          </span>
        </div>
      </div>
    </div>
  );
};

// Main component
const AddEdit = (props) => {
  const { one, loading, setArrayValue } = props;
  const { id: routeID } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState(one.images || []);

  useEffect(() => {
    if (routeID) {
      props.loadOneRequest(routeID);
    }
  }, [routeID]);

  // Handles drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item._id === active.id);
      const newIndex = items.findIndex(item => item._id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
      props.setOneValue({ key: 'images', value: arrayMove(items, oldIndex, newIndex) });
    }
  };

  return (
    loading ? <Loading /> : (
      <>
        <PageHeader title={routeID ? 'Edit Slider' : 'Add Slider'} back="/admin/slider-manage" actions={
          <>
            <Button onClick={() => navigate('/admin/slider-manage')} variant="secondary">
              <FaTimes className="mr-1" /> Cancel
            </Button>
            <Button variant="success" onClick={props.addEditRequest}>
              <FaCheck className="mr-1" /> Save Slide
            </Button>
          </>
        } />

        <PageContent>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(item => item._id)}>
              {items.map((item, index) => (
                <SortableImageItem
                  key={item._id}
                  item={item}
                  index={index}
                  handleSetImage={setArrayValue}
                  handleImageLinkChange={setArrayValue}
                  handleRemoveSlide={(i) => setItems(items.filter((_, idx) => idx !== i))}
                  handleImageEditorChange={setArrayValue}
                />
              ))}
            </SortableContext>
          </DndContext>
        </PageContent>
      </>
    )
  );
};

export default AddEdit;