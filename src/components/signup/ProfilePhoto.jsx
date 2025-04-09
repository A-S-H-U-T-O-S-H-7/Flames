// Profile photo upload component
const ProfilePhotoUpload = ({ photoURL, setPhotoURL, photoFile, setPhotoFile }) => {
  const fileInputRef = useRef(null);
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoURL(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <label className="text-sm font-medium text-gray-700 mb-1">Profile Photo (Optional)</label>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative cursor-pointer"
        onClick={triggerFileInput}
      >
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-200 bg-gray-50 flex items-center justify-center relative">
          {photoURL ? (
            <div className="w-full h-full">
              <img 
                src={photoURL} 
                alt="Profile Preview" 
                className="w-full h-full object-cover"
                style={{
                  objectFit: "cover",
                  objectPosition: "center"
                }}
              />
            </div>
          ) : (
            <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          )}
          
          {/* Overlay with camera icon */}
          <motion.div 
            className="absolute inset-0 bg-purple-500 bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center"
            whileHover={{ opacity: 1 }}
            initial={{ opacity: 0 }}
          >
            <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </motion.div>
        </div>
        
        {/* Fixed sparkling effect */}
        <motion.div 
          className="absolute -inset-1 rounded-full opacity-50"
          animate={{ 
            boxShadow: ["0 0 0px rgba(147, 51, 234, 0)", "0 0 8px rgba(147, 51, 234, 0.5)", "0 0 0px rgba(147, 51, 234, 0)"] 
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
        />
      </motion.div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoChange}
        className="hidden"
        accept="image/*"
      />
      
      <motion.p 
        className="text-xs text-gray-500 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Click to {photoURL ? "change" : "add"} photo
      </motion.p>
    </div>
  );
};