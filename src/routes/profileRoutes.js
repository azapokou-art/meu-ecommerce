const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

    
        const userProfile = {
            ...user,
        
        };

        res.json({
            success: true,
            profile: userProfile
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.put('/update', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, email, phone, cpf, profile_picture } = req.body;

        
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ error: 'User not found' });
        }

       
        if (email && email !== currentUser.email) {
            const emailTaken = await User.isEmailTaken(email, userId);
            if (emailTaken) {
                return res.status(400).json({ error: 'Email already in use' });
            }
        }

        
        const updateData = {
            name: name || currentUser.name,
            email: email || currentUser.email,
            phone: phone || currentUser.phone,
            cpf: cpf || currentUser.cpf,
            profile_picture: profile_picture || currentUser.profile_picture
        };

        const updated = await User.updateProfile(userId, updateData);

        if (!updated) {
            return res.status(500).json({ error: 'Failed to update profile' });
        }

        
        const updatedUser = await User.findById(userId);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.put('/profile-picture', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { profile_picture } = req.body;

        if (!profile_picture) {
            return res.status(400).json({ error: 'Profile picture URL is required' });
        }

        const updated = await User.updateProfilePicture(userId, profile_picture);

        if (!updated) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            message: 'Profile picture updated successfully',
            profile_picture: profile_picture
        });

    } catch (error) {
        console.error('Update profile picture error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;